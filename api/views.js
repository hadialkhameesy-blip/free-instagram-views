module.exports = async (req, res) => {
  // السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموح بها' });
  }

  const { link } = req.body || {};

  // التحقق من صحة رابط إنستغرام
  const igRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/;
  if (!link || !igRegex.test(link)) {
    return res.status(400).json({ error: 'يرجى إدخال رابط منشور إنستغرام أو ريلز صحيح.' });
  }

  // ⚠️ ضع بياناتك الفعلية هنا
  const SMM_API_URL = 'https://my.smm-panel.com/api/v2';
  const SMM_API_KEY = '4016b78781c5e214095d70da41fafca4';
  const SERVICE_ID = '#567
'; 

  try {
    const formData = new URLSearchParams();
    formData.append('key', SMM_API_KEY);
    formData.append('action', 'add');
    formData.append('service', SERVICE_ID);
    formData.append('link', link.trim());
    formData.append('quantity', '100');

    // استخدام fetch المدمج في Node.js 18+ مباشرة
    const response = await fetch(SMM_API_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data && data.order) {
      return res.status(200).json({ success: true, orderId: data.order });
    } else {
      return res.status(400).json({ 
        error: data.error || 'تعذر إرسال المشاهدات، تأكد من توفر رصيد كافٍ وصحة رقم الخدمة.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'تعذر الاتصال بمزود الخدمة: ' + error.message });
  }
};
