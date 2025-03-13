"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { recognizeIngredients } from '@/lib/api';
import RecognitionResult, { IngredientItem } from './RecognitionResult';
import { useRouter } from 'next/navigation';

/**
 * 扫描界面组件
 * @returns JSX.Element
 */
const ScannerView: React.FC = () => {
  // 路由
  const router = useRouter();
  
  // 状态管理
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'voice'>('ai');
  
  // 引用
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // 添加识别到的食材列表状态
  const [recognizedIngredients, setRecognizedIngredients] = useState<IngredientItem[]>([]);
  
  // 初始化摄像头
  const initCamera = async () => {
    try {
      // 如果已有流，先停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // 请求摄像头权限
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      // 保存流的引用
      streamRef.current = mediaStream;
      
      // 设置视频源
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // 确保视频元素已加载元数据后再播放
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setIsCameraReady(true);
                setIsInitialized(true);
              })
              .catch(err => {
                console.error('播放视频失败:', err);
                setIsInitialized(true);
              });
          }
        };
      }
    } catch (err) {
      console.error('摄像头初始化失败:', err);
      // 如果摄像头初始化失败，仍然设置为已初始化，但使用模拟背景
      setIsInitialized(true);
    }
  };
  
  // 组件挂载时初始化摄像头
  useEffect(() => {
    initCamera();
    
    // 清理函数
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
  // 拍照功能
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // 设置画布尺寸与视频相同
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 在画布上绘制当前视频帧
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 将画布内容转换为数据URL
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      
      // 停止视频流以节省资源
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };
  
  // 从相册选择图片
  const selectFromGallery = () => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // 监听文件选择事件
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            setCapturedImage(event.target.result);
            
            // 停止视频流以节省资源
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }
          }
        };
        reader.readAsDataURL(target.files[0]);
      }
      
      // 移除临时元素
      document.body.removeChild(fileInput);
    };
    
    // 添加到DOM并触发点击
    document.body.appendChild(fileInput);
    fileInput.click();
  };
  
  // 返回按钮处理
  const handleBack = () => {
    if (capturedImage) {
      // 如果已拍照，返回到相机界面
      setCapturedImage(null);
      setIsCameraReady(false);
      setShowResult(false);
      setRecognitionResult('');
      
      // 重新初始化摄像头
      setTimeout(() => {
        initCamera();
      }, 100);
    } else {
      // 否则返回上一页
      router.push('/');
    }
  };
  
  // 识别食材
  const recognizeFood = async () => {
    if (!capturedImage) return;
    
    try {
      setIsRecognizing(true);
      setShowResult(true);
      
      // 从 data:image/jpeg;base64, 中提取 base64 部分
      const base64Data = capturedImage.split(',')[1];
      
      // 调用 API 识别食材
      const result = await recognizeIngredients(base64Data);
      
      // 处理可能的 JSON 字符串响应
      let processedResult = result;
      try {
        // 尝试解析 JSON 字符串
        const jsonResult = JSON.parse(result);
        if (Array.isArray(jsonResult) && jsonResult.some(item => item.type === 'text')) {
          // 如果是包含 text 类型的数组，提取文本内容
          processedResult = jsonResult
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');
        }
      } catch (e) {
        // 如果不是 JSON 字符串，直接使用原始结果
        console.log('结果不是 JSON 格式，使用原始文本');
      }
      
      setRecognitionResult(processedResult);
    } catch (error) {
      console.error('识别食材失败:', error);
      setRecognitionResult('识别失败，请重试');
    } finally {
      setIsRecognizing(false);
    }
  };
  
  // 添加到粮仓
  const addToShoppingList = (ingredients: IngredientItem[]) => {
    // 关闭结果弹窗
    setShowResult(false);
    
    // 保存识别到的食材列表
    setRecognizedIngredients(ingredients);
    
    // 跳转到首页
    router.push('/');
    
    // 可以在这里添加将识别结果保存到本地存储或发送到服务器的逻辑
    console.log('添加到粮仓的食材:', ingredients);
    
    // 示例：保存到 localStorage
    try {
      const existingItems = JSON.parse(localStorage.getItem('pantryItems') || '[]');
      const updatedItems = [...existingItems, ...ingredients];
      localStorage.setItem('pantryItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 h-[54px] flex items-center justify-between px-6 z-20">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(56,48,46,0.13)]"
          onClick={handleBack}
        >
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
            <path d="M5 1L1 6L5 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </div>

      {/* 相机视图 */}
      <div className="absolute inset-0 bg-black z-0">
        {/* 视频元素 - 仅在未捕获图像时显示 */}
        {!capturedImage && (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={cn(
              "w-full h-full object-cover",
              isCameraReady ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        
        {/* 捕获的图像 */}
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="已拍摄的图片" 
            className="w-full h-full object-contain"
          />
        )}
        
        {/* 模拟背景 - 仅在相机未就绪时显示 */}
        {!isCameraReady && !capturedImage && isInitialized && (
          <motion.div 
            className="w-full h-full bg-center bg-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), linear-gradient(to right, #2c3e50, #4ca1af)'
            }}
          />
        )}
      </div>

      {/* 隐藏的画布用于拍照 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 扫描框 - 仅在未捕获图像时显示 */}
      {!capturedImage && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] h-[420px] z-10">
          {/* 左上角 */}
          <motion.div 
            className="absolute left-0 top-0 w-14 h-14 border-l-4 border-t-4 border-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* 右上角 */}
          <motion.div 
            className="absolute right-0 top-0 w-14 h-14 border-r-4 border-t-4 border-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* 左下角 */}
          <motion.div 
            className="absolute left-0 bottom-0 w-14 h-14 border-l-4 border-b-4 border-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* 右下角 */}
          <motion.div 
            className="absolute right-0 bottom-0 w-14 h-14 border-r-4 border-b-4 border-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* 提示文本 - 仅在未捕获图像时显示 */}
      {!capturedImage && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[170px] px-4 py-2 bg-[rgba(56,48,46,0.13)] rounded-md z-20">
          <p className="text-sm text-white text-center">支持小票/条形码/食材智能识别</p>
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-white rounded-t-3xl z-10">
        <div className="flex flex-col items-center relative h-full">
          {/* 文字按钮区域 */}
          <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[50px] border-b border-gray-100">
            <div className="flex items-center justify-center gap-12">
              <button 
                className={cn(
                  "px-4 py-2 text-base relative",
                  activeTab === 'ai' ? "text-black" : "text-gray-400"
                )}
                onClick={() => setActiveTab('ai')}
              >
                AI扫描
                {activeTab === 'ai' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button 
                className={cn(
                  "px-4 py-2 text-base relative",
                  activeTab === 'voice' ? "text-black" : "text-gray-400"
                )}
                onClick={() => setActiveTab('voice')}
              >
                语音输入
                {activeTab === 'voice' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
            </div>
          </div>
          
          {/* 相册按钮 - 左下角 */}
          <button 
            className="absolute left-[54px] bottom-[50px]"
            onClick={selectFromGallery}
          >
            <div className="w-9 h-9 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.5 6h-21C6.12 6 4.5 7.62 4.5 9v18c0 1.38 1.62 3 3 3h21c1.38 0 3-1.62 3-3V9c0-1.38-1.62-3-3-3zM10.5 13.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zM27 24H9l4.5-6 3 3.75L21 15l6 9z" fill="currentColor"/>
              </svg>
            </div>
          </button>
          
          {/* 拍照按钮 - 居中 */}
          <motion.button 
            className="absolute left-1/2 transform -translate-x-1/2 bottom-[40px]"
            onClick={takePhoto}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black"></div>
            </div>
          </motion.button>
          
          {/* 识别按钮 - 仅在已拍照时显示 */}
          {capturedImage && (
            <motion.button
              className="absolute right-[40px] bottom-[50px] bg-orange-500 text-white rounded-full px-4 py-2 flex items-center justify-center gap-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={recognizeFood}
            >
              <span className="text-sm font-medium">识别</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M9 5L15 10L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[144px] h-[5px] bg-black rounded-full opacity-30" />
        </div>
      </div>
      
      {/* 识别结果弹窗 */}
      <AnimatePresence>
        {showResult && (
          <RecognitionResult
            result={recognitionResult}
            isLoading={isRecognizing}
            onClose={() => setShowResult(false)}
            onSave={(ingredients) => addToShoppingList(ingredients)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScannerView; 