export type VpnState = 'connected' | 'disconnected' | 'connecting' | 'disconnecting';

export type ProtocolType = 'wireguard' | 'openvpn' | 'shadowsocks' | 'ikev2';

export interface Protocol {
  id: ProtocolType;
  name: string;
  description: string;
  encryption: string;
  port: number;
}

export interface ServerNode {
  id: string;
  name: string;
  flag: string;
  city: string;
  country: string;
  ip: string;
  ping: number;
  load: number;
  status: 'online' | 'maintenance' | 'offline';
  isp: string;
  score: number; // calculated security score
}

export interface ConnectionStats {
  duration: number; // in seconds
  bytesSent: number;
  bytesReceived: number;
  currentSpeedUp: number; // Bps
  currentSpeedDown: number; // Bps
  ping: number;
}

export interface ProxyHistory {
  id: string;
  url: string;
  timestamp: string;
  status: number;
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'info';
  category: string;
  title: string;
  description: string;
  remediation: string;
}

export interface SecurityReport {
  url: string;
  ipAddress: string;
  isSecure: boolean;
  sslValid: boolean;
  sslExpires?: string;
  headersPresent: { [key: string]: boolean };
  issues: SecurityIssue[];
  securityScore: number; // 0 - 100
  tlsVersion?: string;
  serverRegion?: string;
}

export interface TunnelPacket {
  id: string;
  originalText: string;
  encryptedText: string;
  key: string;
  algorithm: string;
  timestamp: number;
  direction: 'client-to-server' | 'server-to-client';
  decrypted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}
