module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموح بها' });
  }

  try {
    const { link } = req.body || {};

    if (!link) {
      return res.status(400).json({ error: 'يرجى إدخال رابط منشور إنستغرام أو ريلز.' });
    }

    const SMM_API_URL = 'https://my.smm-panel.com/api/v2';
    const SMM_API_KEY = '4016b78781c5e214095d70da41fafca4';
    const SERVICE_ID = '531';

    const formData = new URLSearchParams();
    formData.append('key', SMM_API_KEY);
    formData.append('action', 'add');
    formData.append('service', SERVICE_ID);
    formData.append('link', link.trim());
    formData.append('quantity', '100');

    const response = await fetch(SMM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const textResponse = await response.text();
    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      return res.status(502).json({ 
        error: `رد غير متوقع من المزود: ${textResponse.substring(0, 100)}` 
      });
    }

    if (data && data.order) {
      return res.status(200).json({ success: true, orderId: data.order });
    } else {
      return res.status(400).json({ 
        error: data.error || 'تعذر إتمام الطلب من المزود (تأكد من توفر رصيد في الحساب).' 
      });
    }

  } catch (error) {
    return res.status(500).json({ error: `خطأ بالخادم: ${error.message}` });
  }
};
      body: formData.toString()
    });

    const textResponse = await response.text();
    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      return res.status(502).json({ 
        error: `رد غير متوقع من المزود: ${textResponse.substring(0, 100)}` 
      });
    }

    if (data && data.order) {
      return res.status(200).json({ success: true, orderId: data.order });
    } else {
      return res.status(400).json({ 
        error: data.error || 'تعذر إتمام الطلب من المزود (تأكد من توفر رصيد في الحساب).' 
      });
    }

  } catch (error) {
    return res.status(500).json({ error: `خطأ بالخادم: ${error.message}` });
  }
};
