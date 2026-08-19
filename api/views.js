const axios = require('axios');

// ضع بياناتك هنا
const SMM_API_URL = 'https://my.smm-panel.com/api/v2';
const SMM_API_KEY = '4016b78781c5e214095d70da41fafca4
';
const SERVICE_ID = '531'; 

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموح بها' });
  }

  const { link } = req.body;

  // التحقق من صحة رابط إنستغرام
  const igRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
  if (!link || !igRegex.test(link)) {
    return res.status(400).json({ error: 'يرجى إدخال رابط منشور إنستغرام أو ريلز صحيح.' });
  }

  try {
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'add');
    params.append('service', SERVICE_ID);
    params.append('link', link.trim());
    params.append('quantity', '100'); // عدد المشاهدات لكل طلب

    const response = await axios.post(SMM_API_URL, params);

    if (response.data && response.data.order) {
      return res.status(200).json({ 
        success: true, 
        orderId: response.data.order 
      });
    } else {
      return res.status(400).json({ 
        error: response.data.error || 'تعذر إرسال المشاهدات، تأكد من توفر رصيد في حساب المزود.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.' });
  }
};
