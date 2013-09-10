import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import com.notnoop.apns.ApnsServiceBuilder;


import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * @author: suisho
 * @created: 2013/09/10 19:51
 */
public class MockAPNS {
    /**
     * 自己証明無視するmock SSLContextを作成します。
     */
    static public SSLContext createMockSSLContext(){
        KeyManager[] km = null;
        TrustManager[] tm = {
                new X509TrustManager() {
                    public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
                    public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                }
        };
        SSLContext sslcontext= null;
        try {
            sslcontext = SSLContext.getInstance("SSL");
            sslcontext.init(km, tm, new java.security.SecureRandom());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
        return sslcontext;
    }

    /**
     * 自己証明を無視するSSLContextを使って、host:portへ接続するApnsServiceを作成します。
     */
    static public ApnsServiceBuilder newService(String host, int port){
        return MockAPNS.newService()
                       .withGatewayDestination(host, port);
    }

    /**
     * 自己証明を無視するSSLContextを使うApnsServiceを作成します。
     */
    static public ApnsServiceBuilder newService(){
        return APNS.newService().withSSLContext(createMockSSLContext());
    }
}
