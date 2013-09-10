import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import com.notnoop.apns.internal.ApnsConnectionImpl;


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
 * @created: 2013/09/10 16:05
 */
public class Main {
    static public void main(String[] args){
        connect();
    }

    /**
     * 自己証明無視するmock SSLContextを作成します。
     */
    static public SSLContext createMockSSLContext(){
        KeyManager[] km = null;
        TrustManager[] tm = {
                new X509TrustManager() {
                    public void checkClientTrusted(java.security.cert.X509Certificate[] arg0, String arg1) throws CertificateException {}
                    public void checkServerTrusted(java.security.cert.X509Certificate[] arg0, String arg1) throws CertificateException {}
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                }
        };
        SSLContext sslcontext= null;
        try {
            sslcontext = SSLContext.getInstance("SSL");
            sslcontext.init(km, tm, new java.security.SecureRandom());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (KeyManagementException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return sslcontext;
    }

    /**
     * 事故証明を無視するSSLContextを使って、host:portへ接続するApnsServiceを作成します。
     */
    static public ApnsService createMockApnsService(String host, int port){
        ApnsService service = APNS.newService()
                .withSSLContext(createMockSSLContext())
                .withGatewayDestination(host, port).build();
        return service;
    }

    static public void connect(){
        ApnsService service = createMockApnsService("localhost", 7777);
        String payload  = APNS.newPayload()
                .alertBody("foo")
                .build();
        service.push("abcdef1234567890",payload);
    }
}
