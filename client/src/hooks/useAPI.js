import axios from 'axios';

const API_WEATHER_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL_WEATHER;

const API_AI_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const MODEL_URL = import.meta.env.VITE_MODEL_UR;

//WEATHER API
export const getWeatherByCoords = async (lat, lon) => {
  if (!API_WEATHER_KEY) {
    console.error('Lỗi: Vui lòng cung cấp VITE_OPENWEATHERMAP_API_KEY');
    return null;
  }

  if (lat === undefined || lon === undefined) {
    console.error('Lỗi: Thiếu thông tin kinh độ hoặc vĩ độ.');
    return null;
  }

  // units=metric (độ C), lang=vi (tiếng Việt)
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_WEATHER_KEY}&units=metric&lang=vi`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
    }
    const data = await response.json();
    // Chỉ trả về những dữ liệu cần thiết
    return {
      temp: Math.round(data.main.temp), // Làm tròn nhiệt độ
      description: data.weather[0].description, // Mô tả thời tiết
      icon: data.weather[0].icon, // Icon thời tiết
    };
  } catch (error) {
    console.error('Không thể lấy dữ liệu thời tiết:', error);
    return null;
  }
};

// AI CREATE CONTENT MESSAGE
export const handleAiGenerate = async ({ setCustomMessage, setAiError, setIsAiLoading }) => {
  if (!API_AI_KEY) {
    setAiError('Thiếu API Key cho OpenRouter.');
    return;
  }
  setIsAiLoading(true);
  setAiError(null);
  const messageTypeText = document.getElementById('messageType')?.selectedOptions[0]?.text;
  const targetRoleText = document.getElementById('targetRole')?.selectedOptions[0]?.text;
  const recipientText = document.getElementById('targetRecipient')?.selectedOptions[0]?.text;
  const targetDescription = recipientText || targetRoleText;

  const systemPrompt = `Bạn là trợ lý ảo của hệ thống trường trung học cơ sở.
    Soạn tin nhắn thông báo ngắn gọn, trang trọng bằng tiếng Việt.
    Không thêm lời chào, dấu đặc biệt hoặc ký hiệu.`;

  const userPrompt = `Loại thông báo: "${messageTypeText}"
    Người nhận: "${targetDescription}"
    Hãy viết nội dung tin nhắn tối thiểu 15 từ, rõ ràng và lịch sự.`;

  try {
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_AI_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    const result = await response.json();
    const generatedText = result?.choices?.[0]?.message?.content || '';
    setCustomMessage(generatedText.replace(/<s>|<\/s>|\[.*?\]/g, '').trim());
  } catch (err) {
    console.error('Lỗi AI:', err);
    setAiError('Không thể tạo nội dung tự động.');
  } finally {
    setIsAiLoading(false);
  }
};

// API MAP TRACKING

// Hàm tìm tọa độ của một địa chỉ trong danh sách trạm xe buýt
const findCoordinates = (address) => {
  if (typeof address === 'object' && address !== null) {
    const lat = address.lat ?? address.latitude;
    const lon = address.lon ?? address.lng ?? address.longitude;

    if (typeof lat === 'number' && typeof lon === 'number') {
      return [lat, lon];
    }

    console.warn('Object tọa độ không hợp lệ:', address);
    return null;
  }

  console.warn('Không truyền tọa độ hợp lệ:', address);
  return null;
};

// Gọi API để lấy tuyến đường từ OSRM
export const fetchRoute = async ({
  endAddress,
  setStart,
  setRoute,
  setPosition,
  setTraveledPath,
  setTime,
  setDistance,
  setEstimatedTime,
}) => {
  const startAddress = { lat: 10.7581, lng: 106.6822 }; // SGU
  const startCoords = findCoordinates(startAddress);
  const endCoords = findCoordinates(endAddress);

  if (!startCoords || !endCoords) {
    console.error('Không tìm thấy tọa độ hợp lệ cho điểm bắt đầu hoặc kết thúc.');
    return;
  }

  setStart(startCoords);

  const osrmUrl = import.meta.env.VITE_OSRM_URL || 'https://router.project-osrm.org';
  const url = `${osrmUrl}/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;

  try {
    const res = await axios.get(url);
    if (!res.data.routes?.length) {
      console.error('Không tìm thấy tuyến đường hợp lệ từ OSRM.');
      return;
    }

    const route = res.data.routes[0];
    const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
    const distance = route.distance; // mét
    const totalTime = distance / 5; // tốc độ giả định 5 m/s

    setRoute(coords);
    setPosition(coords[0]);
    setTraveledPath([coords[0]]);
    setTime(totalTime / 60); // phút
    setEstimatedTime(totalTime / 60);
    setDistance && setDistance(distance);
  } catch (err) {
    console.error('Lỗi khi lấy route từ OSRM:', err);
  }
};

// Hàm tính toán và định dạng thời gian
export const caculatorTime = (time) => {
  const hour = Math.floor(time / 60);
  const minute = Math.round(time % 60);
  return hour >= 1 ? `Thời gian dự kiến: ${hour}h${minute}ph` : `Thời gian dự kiến: ${minute}ph`;
};
