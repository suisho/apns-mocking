import com.notnoop.apns.*;
import org.testng.annotations.Test;

/**
 * @author: suisho
 * @created: 2013/09/06 12:02
 */

public class MockAPNSTest {
    @Test
    public void test(){
        ApnsService service = MockAPNS.newService("localhost", 3434)
                                    .withDelegate(delegate())
                                    .build();
        String payload;
        payload = APNS.newPayload()
                .alertBody("foo")
                .build();
        service.push("abcdef1234567890",payload);
        payload = APNS.newPayload()
                .alertBody("日本語")
                .build();
        service.push("abcdef", payload);
    }

    public ApnsDelegate delegate(){
        ApnsDelegate d = new ApnsDelegate() {
            @Override
            public void messageSent(ApnsNotification message, boolean resent) {
                System.out.println("Message send success:" + message.getIdentifier());
            }

            @Override
            public void messageSendFailed(ApnsNotification message, Throwable e) {
                System.out.println("Message send failed:" + message.getIdentifier());
            }

            @Override
            public void connectionClosed(DeliveryError e, int messageIdentifier) {
                //To change body of implemented methods use File | Settings | File Templates.
            }

            @Override
            public void cacheLengthExceeded(int newCacheLength) {
                //To change body of implemented methods use File | Settings | File Templates.
            }

            @Override
            public void notificationsResent(int resendCount) {
                //To change body of implemented methods use File | Settings | File Templates.
            }
        };
        return d;
    }
}
