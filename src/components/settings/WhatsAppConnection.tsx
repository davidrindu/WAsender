import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WhatsAppConnectionProps {
  onConnectionStatusChange?: (status: boolean) => void;
}

const WhatsAppConnection = ({
  onConnectionStatusChange,
}: WhatsAppConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsLoading(true);
    setQrCodeVisible(true);

    // Simulate QR code scanning process
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleQrCodeScanned = () => {
    setIsLoading(true);

    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setQrCodeVisible(false);
      setIsLoading(false);

      if (onConnectionStatusChange) {
        onConnectionStatusChange(true);
      }

      toast({
        title: "WhatsApp Connected",
        description: "Your WhatsApp account has been successfully connected.",
        duration: 5000,
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsLoading(true);

    // Simulate disconnection process
    setTimeout(() => {
      setIsConnected(false);
      setIsLoading(false);

      if (onConnectionStatusChange) {
        onConnectionStatusChange(false);
      }

      toast({
        title: "WhatsApp Disconnected",
        description: "Your WhatsApp account has been disconnected.",
        duration: 5000,
      });
    }, 1000);
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
          <Smartphone className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="font-medium text-green-800">WhatsApp Connected</h3>
            <p className="text-sm text-green-700">
              Your WhatsApp account is connected and ready to use
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Connected Number</div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span>+1 (555) 123-4567</span>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Session Information</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Connected Since</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Last Activity</p>
              <p className="font-medium">
                Today,{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            className="text-red-600"
            onClick={handleDisconnect}
            disabled={isLoading}
          >
            {isLoading ? "Disconnecting..." : "Disconnect WhatsApp"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {qrCodeVisible ? (
        <>
          <div className="relative mb-4">
            <div className="border-4 border-green-500 rounded-lg p-2 bg-white">
              <QrCode className="h-48 w-48 text-gray-800" />
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
                <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Scan QR Code with WhatsApp
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            Open WhatsApp on your phone, tap Menu or Settings and select
            WhatsApp Web. Point your phone to this screen to capture the code.
          </p>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setQrCodeVisible(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleQrCodeScanned}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "I've Scanned the Code"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <QrCode className="h-32 w-32 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Connect WhatsApp
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            To use the WhatsApp Scheduler, you need to connect your WhatsApp
            account by scanning a QR code with your phone.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 max-w-md text-left">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Your WhatsApp account must remain connected for scheduled
                messages to be sent. If you log out or disconnect, pending
                messages will not be delivered.
              </p>
            </div>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Connect WhatsApp"}
          </Button>
        </>
      )}
    </div>
  );
};

export default WhatsAppConnection;
