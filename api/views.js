const axios = require('axios');

// استبدل هذه البيانات ببياناتك من مزود الـ SMM
const SMM_API_URL = 'https://YOUR_SMM_PANEL_DOMAIN.com/api/v2';
const SMM_API_KEY = 'YOUR_API_KEY_HERE';
const SERVICE_ID = '123'; // رقم خدمة المشاهدات في المزود

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموح بها' });
  }

  const { link } = req.body;

  // التحقق من صحة رابط المنشور أو الريلز
  const igRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
  if (!link || !igRegex.test(link)) {
    return res.status(400).json({ error: 'يرجى إدخال رابط منشور إنستغرام أو ريلز صحيح.' });
  }

  try {
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'add');
    params.append('service', SERVICE_ID);
    params.append('link', link);
    params.append('quantity', '100'); // الكمية المجانية لكل ضغطة

    const response = await axios.post(SMM_API_URL, params);

    if (response.data && response.data.order) {
      return res.status(200).json({ success: true, orderId: response.data.order });
    } else {
      return res.status(400).json({ 
        error: response.data.error || 'تعذر تنفيذ الطلب حالياً، تأكد من رصيدك في المزود.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'حدث خطأ في الخادم أثناء الاتصال بالمزود.' });
  }
}
