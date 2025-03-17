/**
 * API 服务
 * 处理与 SiliconFlow API 的通信
 */

import { SILICONFLOW_CONFIG } from './config';

// 定义消息类型
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<MessageContent>;
}

// 定义消息内容类型
interface MessageContent {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
  [key: string]: unknown;
}

// 定义 API 响应类型
interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 识别食材
 * @param imageBase64 图片的 Base64 编码
 * @returns 识别结果
 */
export async function recognizeIngredients(imageBase64: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;
    const apiUrl = SILICONFLOW_CONFIG.API_URL;
    const model = 'deepseek-ai/deepseek-vl2'; // 使用 DeepSeek-VL2 视觉模型

    if (!apiKey) {
      throw new Error('API 密钥未设置');
    }

    // 构建系统提示
    const systemPrompt = `你是一个专业的食材识别助手。请识别图片中的所有食材，并按以下格式返回结果：

1. 食材名称：数量 x 单位（估计重量，单位为克）
2. 食材名称：数量 x 单位（估计重量，单位为克）
...

例如：
1. 西红柿：2个（约300克）
2. 洋葱：1个（约150克）
3. 鸡胸肉：1块（约200克）

请尽可能详细地描述食材的种类、数量和估计重量。如果无法确定准确数量或重量，请给出合理的估计值。
如果无法识别图片中的内容，请回复"无法识别图片中的食材"。

请只返回食材列表，不要有其他解释或描述。`;

    // 构建用户消息（包含图片）
    const userMessage: Message = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: '请识别图片中的所有食材，包括种类、数量和估计重量。'
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`
          }
        }
      ]
    };

    // 构建请求消息
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      userMessage
    ];

    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.2, // 低温度，提高确定性
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

    const data: ApiResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? content : JSON.stringify(content);
    } else {
      throw new Error('API 返回的响应中没有内容');
    }
  } catch (error) {
    console.error('识别食材时出错:', error);
    return '识别失败，请重试';
  }
}

/**
 * 处理语音输入的食材识别
 * @param voiceText 语音转文字的内容
 * @returns 识别结果
 */
export async function recognizeVoiceInput(voiceText: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;
    const apiUrl = SILICONFLOW_CONFIG.API_URL;
    const model = 'Qwen/Qwen2.5-7B-Instruct'; // 使用 Qwen2.5-7B-Instruct 模型

    if (!apiKey) {
      throw new Error('API 密钥未设置');
    }

    // 构建系统提示
    const systemPrompt = `你是一个专业的食材识别助手。用户会通过语音输入描述他们的食材，你需要将这些描述转换为结构化的食材列表。

请按照以下格式输出每种食材：
【食材名称^数量^重量】

例如：
【西红柿^2个^300克】
【洋葱^1个^150克】
【鸡胸肉^1块^200克】

注意事项：
1. 每种食材占一行
2. 如果用户没有明确提到数量，请根据常识给出合理的估计
3. 如果用户没有明确提到重量，请根据数量给出合理的估计重量（单位统一使用克）
4. 不要添加任何额外的解释或描述，只返回食材列表
5. 确保每个食材都包含名称、数量和重量三个部分

如果无法从用户输入中识别出任何食材，请返回"未识别出任何食材"。`;

    // 构建用户消息
    const userMessage: Message = {
      role: 'user',
      content: voiceText
    };

    // 构建请求消息
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      userMessage
    ];

    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.2, // 低温度，提高确定性
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

    const data: ApiResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? content : JSON.stringify(content);
    } else {
      throw new Error('API 返回的响应中没有内容');
    }
  } catch (error) {
    console.error('处理语音输入时出错:', error);
    return '识别失败，请重试';
  }
} 