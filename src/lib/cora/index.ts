import axios from 'axios';
import https from 'https';

const CORA_ENV = process.env.CORA_ENVIRONMENT === 'production' 
  ? 'https://api.cora.com.br' 
  : 'https://matls-clients.api.sandbox.cora.com.br';

const clientId = process.env.CORA_CLIENT_ID || '';
const clientSecret = process.env.CORA_CLIENT_SECRET || '';
const certificate = process.env.CORA_CERTIFICATE?.replace(/\\n/g, '\n') || '';
const privateKey = process.env.CORA_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

function getHttpsAgent() {
  return new https.Agent({
    cert: certificate,
    key: privateKey,
  });
}

export async function getCoraAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const agent = getHttpsAgent();
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', clientId);

  const response = await axios.post(`${CORA_ENV}/token`, data.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    httpsAgent: agent,
  });

  cachedToken = response.data.access_token;
  // Cora tokens usually expire in 3600 seconds
  tokenExpiresAt = now + (response.data.expires_in * 1000);

  return cachedToken as string;
}

interface CreatePixChargeParams {
  amountInCents: number;
  internalCode: string;
  customerName: string;
  customerEmail: string;
  customerCpfCnpj: string;
  idempotencyKey: string;
}

export async function createPixCharge(params: CreatePixChargeParams) {
  const token = await getCoraAccessToken();
  const agent = getHttpsAgent();

  const payload = {
    request_id: params.idempotencyKey,
    name: "Pagamento de Conteúdo",
    description: `Compra na loja: ${params.internalCode}`,
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      document: {
        identity: params.customerCpfCnpj,
      }
    },
    payment_terms: {
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
      payment_types: ["PIX"]
    },
    services: [
      {
        name: "Conteúdo Digital",
        amount: params.amountInCents,
        code: params.internalCode
      }
    ]
  };

  const response = await axios.post(`${CORA_ENV}/invoices`, payload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': params.idempotencyKey
    },
    httpsAgent: agent,
  });

  return response.data;
}

export async function getPixCharge(invoiceId: string) {
  const token = await getCoraAccessToken();
  const agent = getHttpsAgent();

  const response = await axios.get(`${CORA_ENV}/invoices/${invoiceId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    httpsAgent: agent,
  });

  return response.data;
}
