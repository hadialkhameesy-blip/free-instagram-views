// api/view.js - نسخة محسنة ومحمية ضد انهيار السيرفر
export default async function handler(req, res) {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { links, service_id, api_key } = req.body;

        if (!links || !service_id || !api_key) {
            return res.status(400).json({ success: false, message: 'الرجاء التأكد من إدخال الروابط ورقم الخدمة ومفتاح الـ API' });
        }

        // تقسيم الروابط وتصفية الأسطر الفارغة
        const linkArray = links.split('\n').map(link => link.trim()).filter(link => link.length > 0);
        
        if (linkArray.length === 0) {
            return res.status(400).json({ success: false, message: 'لا توجد روابط صالحة للإرسال' });
        }

        const results = [];
        const SMM_API_URL = 'https://my.smm-panel.com/api/v2';

        for (const link of linkArray) {
            try {
                const params = new URLSearchParams();
                params.append('key', api_key);
                params.append('action', 'add');
                params.append('service', service_id);
                params.append('link', link);
                params.append('quantity', '1000'); // الكمية الافتراضية

                const response = await fetch(SMM_API_URL, {
                    method: 'POST',
                    body: params,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                // التحقق مما إذا كانت الاستجابة صالحة وليست صفحة خطأ HTML
                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    data = { error: 'Invalid JSON response from provider', raw: responseText };
                }

                results.push({ link, response: data });
            } catch (err) {
                results.push({ link, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });

    } catch (error) {
        // التقاط أي خطأ عام يمنع انهيار الدالة كلياً وإظهار السبب الحقيقي
        console.error('Server Error:', error);
        return res.status(500).json({ success: false, message: 'حدث خطأ داخلي في الخادم: ' + error.message });
    }
}
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
