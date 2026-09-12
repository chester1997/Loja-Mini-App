"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, Loader2, QrCode } from "lucide-react";

export default function CheckoutPage({ params }: { params: { contentId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [status, setStatus] = useState("pending"); // pending, paid, expired, errored
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function createPayment() {
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentId: params.contentId })
        });
        const data = await res.json();
        
        if (!res.ok) {
          if (data.status === "paid") {
            // Already paid
            setStatus("paid");
            setLoading(false);
            return;
          }
          throw new Error(data.error || "Erro ao criar pagamento");
        }

        setPaymentData(data);
        setStatus(data.status);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    createPayment();
  }, [params.contentId]);

  useEffect(() => {
    if (status !== "pending" || !paymentData?.purchaseId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${paymentData.purchaseId}`);
        const data = await res.json();
        
        if (data.status && data.status !== "pending") {
          setStatus(data.status);
          clearInterval(interval);
        }
      } catch (err) {
        // silently ignore polling errors
      }
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [status, paymentData]);

  const handleCopy = () => {
    if (paymentData?.pixCopyPaste) {
      navigator.clipboard.writeText(paymentData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Gerando seu PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <div className="bg-red-900/50 p-6 rounded-xl border border-red-500/50 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Ops, algo deu errado</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button onClick={() => router.back()} className="bg-white text-black px-6 py-2 rounded font-semibold w-full">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <div className="bg-green-900/20 p-8 rounded-xl border border-green-500/30 max-w-md w-full flex flex-col items-center">
          <CheckCircle2 size={64} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h2>
          <p className="text-gray-400 mb-8">Seu conteúdo foi liberado e já está disponível na sua conta.</p>
          
          <button 
            onClick={() => router.push(`/assistir/${params.contentId}`)}
            className="bg-white text-black px-6 py-3 rounded font-bold w-full hover:bg-gray-200 transition"
          >
            Assistir Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="bg-neutral-900 p-6 md:p-8 rounded-2xl border border-neutral-800 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Finalizar Compra</h1>
          <p className="text-gray-400 text-sm">Escaneie o QR Code abaixo com o aplicativo do seu banco para pagar via PIX.</p>
        </div>

        {paymentData?.qrCodeUrl ? (
          <div className="bg-white p-4 rounded-xl flex items-center justify-center mx-auto w-64 h-64 mb-6">
            {/* The Cora API qrCodeUrl is actually base64 image data or URL depending on what you mapped. Assuming Base64 data URL for this example if it returns that, or just an image URL */}
            <img src={paymentData.qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="bg-neutral-800 w-64 h-64 mx-auto mb-6 rounded-xl flex items-center justify-center border border-neutral-700">
             <QrCode size={48} className="text-neutral-600" />
          </div>
        )}

        <div className="bg-black/50 p-4 rounded-lg mb-6 text-center border border-neutral-800">
           <p className="text-gray-400 text-xs mb-1">Valor da compra</p>
           <p className="text-2xl font-bold text-green-400">
             R$ {Number(paymentData?.amount || 0).toFixed(2).replace('.', ',')}
           </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center w-full bg-neutral-800 text-white py-3 rounded-lg font-semibold hover:bg-neutral-700 transition border border-neutral-700"
          >
            {copied ? (
              <span className="text-green-400">Copiado!</span>
            ) : (
              <>
                <Copy size={18} className="mr-2" />
                Copiar Código PIX
              </>
            )}
          </button>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-full bg-transparent text-gray-500 py-3 rounded-lg font-semibold hover:text-white transition"
          >
            Cancelar Compra
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Aguardando pagamento...</span>
        </div>
      </div>
    </div>
  );
}
