import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Activity, 
  Cpu, 
  Terminal, 
  Lock, 
  Unlock, 
  Search, 
  Compass, 
  RefreshCw, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Wifi, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Database
} from 'lucide-react';
import { 
  ServerNode, 
  Protocol, 
  ProtocolType, 
  VpnState, 
  ConnectionStats, 
  ProxyHistory, 
  SecurityReport, 
  TunnelPacket, 
  ChatMessage 
} from './types';

// Standard server list with robust default configurations
const DEFAULT_SERVERS: ServerNode[] = [
  { id: 'us-east', name: 'USA - New York', flag: '🇺🇸', city: 'New York', country: 'United States', ip: '104.244.42.1', ping: 32, load: 45, status: 'online', isp: 'Equinix Metal', score: 98 },
  { id: 'uk-london', name: 'United Kingdom - London', flag: '🇬🇧', city: 'London', country: 'United Kingdom', ip: '185.112.144.20', ping: 48, load: 28, status: 'online', isp: 'DigitalOcean LLC', score: 95 },
  { id: 'de-frankfurt', name: 'Germany - Frankfurt', flag: '🇩🇪', city: 'Frankfurt', country: 'Germany', ip: '46.165.221.12', ping: 12, load: 62, status: 'online', isp: 'Leaseweb Germany', score: 99 },
  { id: 'sg-singapore', name: 'Singapore - Jurong', flag: '🇸🇬', city: 'Singapore', country: 'Singapore', ip: '128.199.122.9', ping: 184, load: 39, status: 'online', isp: 'Linode Singapore', score: 92 },
  { id: 'jp-tokyo', name: 'Japan - Tokyo', flag: '🇯🇵', city: 'Tokyo', country: 'Japan', ip: '139.162.112.5', ping: 210, load: 74, status: 'online', isp: 'KDDI Corporation', score: 94 },
  { id: 'ca-toronto', name: 'Canada - Toronto', flag: '🇨🇦', city: 'Toronto', country: 'Canada', ip: '198.50.144.52', ping: 55, load: 18, status: 'online', isp: 'OVH Hosting', score: 96 },
  { id: 'ch-zurich', name: 'Switzerland - Zurich', flag: '🇨🇭', city: 'Zurich', country: 'Switzerland', ip: '179.125.12.88', ping: 24, load: 12, status: 'online', isp: 'Solar Communications', score: 100 },
  { id: 'au-sydney', name: 'Australia - Sydney', flag: '🇦🇺', city: 'Sydney', country: 'Australia', ip: '103.25.56.12', ping: 245, load: 81, status: 'online', isp: 'Vocus Communications', score: 91 },
];

const PROTOCOLS: Protocol[] = [
  { id: 'wireguard', name: 'WireGuard®', description: 'Next-gen lean protocol operating in kernel space utilizing modern cryptographic primitives.', encryption: 'ChaCha20-Poly1305 / Noise Protocol', port: 51820 },
  { id: 'openvpn', name: 'OpenVPN (UDP)', description: 'Classic feature-rich enterprise tunneling leveraging OpenSSL cryptography.', encryption: 'AES-256-GCM / SHA-512', port: 1194 },
  { id: 'shadowsocks', name: 'Shadowsocks', description: 'Lightweight SOCKS5 secure proxy designed specifically to bypass deep packet inspection.', encryption: 'AEAD AES-256-GCM', port: 8388 },
  { id: 'ikev2', name: 'IKEv2 / IPsec', description: 'Excellent mobile protocol with rapid reconnect capabilities on network changes.', encryption: 'AES-256-CBC / Diffie-Hellman 14', port: 500 }
];

export default function App() {
  // Main State Managers
  const [vpnState, setVpnState] = useState<VpnState>('disconnected');
  const [selectedServer, setSelectedServer] = useState<ServerNode>(DEFAULT_SERVERS[2]); // Frankfurt optimal default
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(PROTOCOLS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time Traffic Counters
  const [stats, setStats] = useState<ConnectionStats>({
    duration: 0,
    bytesSent: 154820,
    bytesReceived: 1255400,
    currentSpeedUp: 0,
    currentSpeedDown: 0,
    ping: 12
  });

  // Proxy Client state
  const [proxyUrl, setProxyUrl] = useState('https://wikipedia.org');
  const [activeIframeUrl, setActiveIframeUrl] = useState('');
  const [isProxyLoading, setIsProxyLoading] = useState(false);
  const [proxyHistory, setProxyHistory] = useState<ProxyHistory[]>([
    { id: '1', url: 'https://wikipedia.org', timestamp: '19:42:10', status: 200 },
    { id: '2', url: 'https://news.ycombinator.com', timestamp: '19:30:15', status: 200 }
  ]);

  // Security Audit state
  const [auditInputUrl, setAuditInputUrl] = useState('https://news.ycombinator.com');
  const [auditReport, setAuditReport] = useState<SecurityReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState('');

  // Cryptographic Packet Inspection Streams
  const [packetStream, setPacketStream] = useState<TunnelPacket[]>([
    { id: 'p1', originalText: 'GET /index.html HTTP/1.1', encryptedText: 'f5e93c12a84d9f0b7c352a10d9f8e4c7b2a10e98', key: 'WG_EPHEMERAL_3FA2', algorithm: 'ChaCha20-Poly1305', timestamp: Date.now() - 3000, direction: 'client-to-server', decrypted: true },
    { id: 'p2', originalText: 'HTTP/1.1 200 OK (Content: text/html)', encryptedText: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', key: 'WG_EPHEMERAL_3FA2', algorithm: 'ChaCha20-Poly1305', timestamp: Date.now() - 2800, direction: 'server-to-client', decrypted: true }
  ]);
  const [customPacketInput, setCustomPacketInput] = useState('');

  // AI Security Advisor Assistant Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'c1', sender: 'system', text: 'VPN Cryptographic Engine loaded successfully.', timestamp: '19:48:31' },
    { id: 'c2', sender: 'assistant', text: 'Greetings operator. I am your VPN Security Advisor. Ask me anything about modern tunneling (WireGuard vs OpenVPN), DNS leak protection, AES/ChaCha20 ciphers, or how our regional server proxies shield your identity.', timestamp: '19:48:32' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Active Interactive Tab State (Center Column panel)
  const [activeTab, setActiveTab] = useState<'proxy' | 'audit' | 'anonymity'>('proxy');

  // Ref hooks
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Anonymity & IP Threat Vector analysis stats
  const [userIpInfo, setUserIpInfo] = useState({
    originalIp: '182.160.44.129', // Mock original User IP
    currentIp: '182.160.44.129',
    isp: 'Local ISP Corp',
    dnsServer: 'Local Broadband DNS (Unencrypted)',
    webrtcLeak: 'Vulnerable (Leaking 192.168.1.45)',
    dnsLeakStatus: 'Vulnerable',
    location: 'Pakistan, Karachi'
  });

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Traffic updates and timers when connected
  useEffect(() => {
    if (vpnState === 'connected') {
      // Start connection stopwatch and live traffic rate simulator
      timerRef.current = setInterval(() => {
        setStats(prev => {
          const upRate = Math.floor(Math.random() * 450000) + 12000; // random upload speeds
          const downRate = Math.floor(Math.random() * 2800000) + 150000; // download speeds
          
          return {
            duration: prev.duration + 1,
            bytesSent: prev.bytesSent + upRate,
            bytesReceived: prev.bytesReceived + downRate,
            currentSpeedUp: upRate,
            currentSpeedDown: downRate,
            ping: selectedServer.ping + Math.floor(Math.random() * 5) - 2
          };
        });

        // Periodically inject a packet log into the cryptostream
        if (Math.random() > 0.6) {
          const mockPackets = [
            { org: 'GET /api/v1/auth HTTP/2', dir: 'client-to-server' as const },
            { org: 'HTTP/2 200 OK TokenAuthorized', dir: 'server-to-client' as const },
            { org: 'DNS lookup: securecloud.internal', dir: 'client-to-server' as const },
            { org: 'POST /telemetry/metrics HTTP/1.1', dir: 'client-to-server' as const },
            { org: 'TLS ClientHello (ALPN: h2)', dir: 'client-to-server' as const }
          ];
          const choice = mockPackets[Math.floor(Math.random() * mockPackets.length)];
          const key = 'WG_EPHEMERAL_' + Math.random().toString(36).substr(2, 4).toUpperCase();
          const enc = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
          
          setPacketStream(prev => [
            {
              id: 'p-' + Math.random().toString(36).substr(2, 5),
              originalText: choice.org,
              encryptedText: enc,
              key: key,
              algorithm: selectedProtocol.id === 'wireguard' ? 'ChaCha20-Poly1305' : 'AES-256-GCM',
              timestamp: Date.now(),
              direction: choice.dir,
              decrypted: true
            },
            ...prev.slice(0, 15) // Keep last 15
          ]);
        }

      }, 1000);

      // Update Simulated IP Info
      setUserIpInfo(prev => ({
        ...prev,
        currentIp: selectedServer.ip,
        isp: selectedServer.isp,
        dnsServer: 'Encrypted DNS Pool (' + selectedServer.ip.split('.').slice(0,3).join('.') + '.254)',
        webrtcLeak: 'Protected (Fully Spoofed & Masked)',
        dnsLeakStatus: 'Fully Protected',
        location: `${selectedServer.city}, ${selectedServer.country}`
      }));

    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setStats(prev => ({
        ...prev,
        currentSpeedUp: 0,
        currentSpeedDown: 0,
        ping: 0
      }));

      // Revert Simulated IP Info
      setUserIpInfo(prev => ({
        ...prev,
        currentIp: prev.originalIp,
        isp: 'Local ISP Corp',
        dnsServer: 'Local Broadband DNS (Unencrypted)',
        webrtcLeak: 'Vulnerable (Leaking 192.168.1.45)',
        dnsLeakStatus: 'Vulnerable',
        location: 'Pakistan, Karachi'
      }));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [vpnState, selectedServer, selectedProtocol]);

  // Handle Main Connect Trigger
  const handleConnectToggle = () => {
    if (vpnState === 'disconnected') {
      setVpnState('connecting');
      // Create handshake animation sequence
      setTimeout(() => {
        setVpnState('connected');
        setChatMessages(prev => [
          ...prev,
          { id: 'conn-' + Date.now(), sender: 'system', text: `🛡️ Established Secure Tunnel via ${selectedProtocol.name} to ${selectedServer.name}. Node IP: ${selectedServer.ip}`, timestamp: new Date().toTimeString().slice(0, 8) }
        ]);
      }, 1200);
    } else if (vpnState === 'connected') {
      setVpnState('disconnecting');
      setTimeout(() => {
        setVpnState('disconnected');
        setChatMessages(prev => [
          ...prev,
          { id: 'disc-' + Date.now(), sender: 'system', text: `⚠️ Secure tunnel disconnected. Traffic reverted to native ISP routing cleartext.`, timestamp: new Date().toTimeString().slice(0, 8) }
        ]);
        // Reset timers
        setStats(prev => ({ ...prev, duration: 0 }));
      }, 800);
    }
  };

  // Web Proxy Browser Trigger
  const handleProxyGo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!proxyUrl) return;

    setIsProxyLoading(true);
    let target = proxyUrl;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    // Build the request targeting our Express proxy router `/api/proxy?url=`
    const proxiedTarget = `/api/proxy?url=${encodeURIComponent(target)}`;
    setActiveIframeUrl(proxiedTarget);

    // Save history
    const timestamp = new Date().toTimeString().slice(0, 8);
    setProxyHistory(prev => [
      { id: Date.now().toString(), url: target, timestamp, status: 200 },
      ...prev.slice(0, 8)
    ]);

    setTimeout(() => {
      setIsProxyLoading(false);
    }, 1000);
  };

  // Run Real-time Security & Header Auditor
  const handleRunSecurityAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auditInputUrl) return;

    setIsAuditing(true);
    setAuditError('');
    setAuditReport(null);

    try {
      const response = await fetch(`/api/security-audit?url=${encodeURIComponent(auditInputUrl)}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setAuditReport(data);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'Failed to scan target host connection parameters.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Run Dynamic Binary Speedtest
  const runSpeedTest = async () => {
    if (vpnState !== 'connected') {
      alert("You must establish an active tunnel connection before running an optimized speed test!");
      return;
    }

    setChatMessages(prev => [
      ...prev,
      { id: 'st-' + Date.now(), sender: 'system', text: '⚡ Initializing tunnel speed test. Requesting binary payload blocks...', timestamp: new Date().toTimeString().slice(0, 8) }
    ]);

    const startTime = Date.now();
    try {
      // Fetch small 5MB binary data block from /api/speedtest to measure exact network speeds
      const res = await fetch('/api/speedtest?size=5');
      if (!res.ok) throw new Error('Speedtest endpoint unavailable');
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream reader failed');

      let receivedBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedBytes += value.length;
      }

      const durationMs = Date.now() - startTime;
      const durationSec = durationMs / 1000;
      const speedBps = receivedBytes / durationSec;
      const speedMbps = (speedBps * 8) / (1024 * 1024);

      setChatMessages(prev => [
        ...prev,
        { id: 'st-res-' + Date.now(), sender: 'assistant', text: `📈 **Tunnel Speed Test Results:**\n- **Size**: 5 MB\n- **Duration**: ${durationSec.toFixed(2)}s\n- **Latency**: ${selectedServer.ping}ms\n- **Optimized Download**: **${speedMbps.toFixed(2)} Mbps** via encrypted tunnel node.`, timestamp: new Date().toTimeString().slice(0, 8) }
      ]);
    } catch (err: any) {
      console.error(err);
      // Fallback if proxy blocking
      setChatMessages(prev => [
        ...prev,
        { id: 'st-err-' + Date.now(), sender: 'system', text: '❌ Speedtest failed. Network routing interrupted.', timestamp: new Date().toTimeString().slice(0, 8) }
      ]);
    }
  };

  // Send AI Chat Message
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toTimeString().slice(0, 8)
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const response = await fetch('/api/security-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMsg] })
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error.');
      }

      const data = await response.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toTimeString().slice(0, 8)
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: '🛡️ **[Advisor Error]** Failed to contact neural security models. Please check your credentials.',
          timestamp: new Date().toTimeString().slice(0, 8)
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Send Custom Packet Encryption Test
  const handleCustomPacketEncrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPacketInput.trim()) return;

    const key = 'WG_EPHEMERAL_' + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    // Simple custom simulation of AES hex encryptor
    const textBytes = new TextEncoder().encode(customPacketInput);
    const hexEncrypted = Array.from(textBytes)
      .map(b => (b ^ 42).toString(16).padStart(2, '0')) // simple xor cipher simulation
      .join('');

    const newPacket: TunnelPacket = {
      id: 'cust-' + Date.now(),
      originalText: customPacketInput,
      encryptedText: hexEncrypted,
      key: key,
      algorithm: selectedProtocol.id === 'wireguard' ? 'ChaCha20-Poly1305' : 'AES-256-GCM',
      timestamp: Date.now(),
      direction: 'client-to-server',
      decrypted: false
    };

    setPacketStream(prev => [newPacket, ...prev]);
    setCustomPacketInput('');

    // Trigger auto decrypt transition state in console
    setTimeout(() => {
      setPacketStream(prev => prev.map(p => p.id === newPacket.id ? { ...p, decrypted: true } : p));
    }, 1500);
  };

  // Helper formatting download bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format Speed Rate
  const formatSpeed = (bps: number) => {
    const mbps = (bps * 8) / (1024 * 1024);
    if (mbps > 1) return mbps.toFixed(1) + ' Mb/s';
    return ((bps * 8) / 1024).toFixed(0) + ' Kb/s';
  };

  // Filter Server Nodes
  const filteredServers = DEFAULT_SERVERS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#050B18] text-slate-100 font-sans flex flex-col relative cyber-grid">
      
      {/* Background Decorative Glow Panels */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header Bar */}
      <header id="main-header" className="border-b border-slate-800/60 bg-[#050B18]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)] border border-cyan-400/20">
            <Shield className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">NEON<span className="text-cyan-400">SHIELD</span></span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30">SANDBOX</span>
            </div>
            <p className="text-[10px] text-slate-500">Virtual Private Network & Tunnel Router Platform</p>
          </div>
        </div>

        {/* Global Connection Badges */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 space-x-3">
            <span className="text-xs text-slate-400">Protocol:</span>
            <select 
              value={selectedProtocol.id} 
              onChange={(e) => {
                const found = PROTOCOLS.find(p => p.id === e.target.value);
                if (found) setSelectedProtocol(found);
              }}
              className="bg-transparent text-xs font-semibold text-cyan-400 outline-none cursor-pointer focus:ring-0 border-none p-0"
              disabled={vpnState === 'connecting' || vpnState === 'disconnecting'}
            >
              {PROTOCOLS.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-950 text-slate-300">{p.name}</option>
              ))}
            </select>
          </div>

          <div className={`flex items-center px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
            vpnState === 'connected' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
              : vpnState === 'connecting'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              vpnState === 'connected' 
                ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' 
                : vpnState === 'connecting' 
                ? 'bg-amber-400 animate-ping' 
                : 'bg-slate-600'
            }`}></span>
            <span className="uppercase tracking-wider font-mono text-[10px]">
              {vpnState === 'connected' ? 'SECURED' : vpnState === 'connecting' ? 'TUNNELING...' : 'NOT SECURED'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 relative">
        
        {/* ================= COLUMN 1: Location & Node Switcher (cols 3) ================= */}
        <section id="servers-panel" className="lg:col-span-3 bg-[#070E1E]/80 border border-slate-800/60 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md shadow-2xl h-[calc(100vh-140px)] min-h-[580px]">
          
          {/* Optimal server showcase */}
          <div className="p-4 border-b border-slate-800/50 bg-[#0c142c]/50">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">OPTIMAL NODE POOL</h3>
            
            <div 
              onClick={() => {
                if (vpnState === 'disconnected') {
                  setSelectedServer(DEFAULT_SERVERS[2]); // Zurich/Germany
                }
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedServer.id === 'de-frankfurt' 
                  ? 'bg-cyan-950/20 border-cyan-500/40 ring-1 ring-cyan-500/20' 
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🇩🇪</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Frankfurt, Germany</h4>
                  <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">Fastest Response</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400">12ms</div>
                <div className="text-[9px] text-slate-500">Load: 62%</div>
              </div>
            </div>
          </div>

          {/* Search filter */}
          <div className="p-3 border-b border-slate-800/40 flex items-center bg-slate-950/40">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Filter nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 outline-none w-full p-0 focus:ring-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] text-slate-400 hover:text-white">Clear</button>
            )}
          </div>

          {/* Nodes list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
            {filteredServers.length > 0 ? (
              filteredServers.map((server) => {
                const isSelected = selectedServer.id === server.id;
                return (
                  <div
                    key={server.id}
                    onClick={() => {
                      if (vpnState === 'connecting' || vpnState === 'disconnecting') return;
                      setSelectedServer(server);
                      if (vpnState === 'connected') {
                        // Dynamically switch server connection
                        setVpnState('connecting');
                        setTimeout(() => {
                          setVpnState('connected');
                          setChatMessages(prev => [
                            ...prev,
                            { id: 'switch-' + Date.now(), sender: 'system', text: `🔄 Redirected client tunnel to server [${server.name}] - Gateway IP: ${server.ip}`, timestamp: new Date().toTimeString().slice(0, 8) }
                          ]);
                        }, 800);
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60 hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl shrink-0">{server.flag}</span>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-medium truncate ${isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>{server.city}</h4>
                        <p className="text-[9px] text-slate-500 truncate font-mono">{server.ip}</p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className={`text-xs font-mono font-semibold ${
                        server.ping < 50 ? 'text-emerald-400' : server.ping < 120 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {server.ping}ms
                      </div>
                      <div className="w-12 bg-slate-950 rounded-full h-1 mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${server.load > 75 ? 'bg-rose-500' : server.load > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                          style={{ width: `${server.load}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">No VPN node matched query</div>
            )}
          </div>

          {/* Quick Technical stats panel */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/50 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">ACTIVE HANDSHAKE</span>
              <span className="text-slate-300 font-mono">{vpnState === 'connected' ? 'EVERY 2 MIN' : 'NONE'}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">UDP CHECKSUMS</span>
              <span className="text-emerald-400 font-mono">VERIFIED</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">ENCRYPTION ENGINE</span>
              <span className="text-cyan-400 font-mono text-[9px] truncate max-w-[120px]">{selectedProtocol.encryption}</span>
            </div>
          </div>
        </section>


        {/* ================= COLUMN 2: Dial & Core interactive Sandbox (cols 6) ================= */}
        <section id="dial-and-sandbox" className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* Connection Dial Core */}
          <div className="bg-[#070E1E]/80 border border-slate-800/60 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col items-center">
            
            {/* Visual ambient pulse background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`absolute w-80 h-80 rounded-full transition-all duration-1000 blur-[80px] ${
                vpnState === 'connected' 
                  ? 'bg-emerald-500/10' 
                  : vpnState === 'connecting'
                  ? 'bg-amber-500/10'
                  : 'bg-cyan-500/5'
              }`}></div>
            </div>

            <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Dial Button */}
              <div className="relative flex items-center justify-center shrink-0">
                
                {/* Spinning cryptographic background borders */}
                <div className={`absolute w-52 h-52 rounded-full border-2 border-dashed transition-all duration-[4000ms] ease-linear ${
                  vpnState === 'connected' ? 'border-emerald-500/30 rotate-180 scale-105' : 'border-slate-800'
                }`}></div>

                <div className={`absolute w-44 h-44 rounded-full border border-double transition-all duration-[2000ms] ${
                  vpnState === 'connected' ? 'border-cyan-400/50 scale-100' : 'border-slate-900'
                }`}></div>

                {/* Main Dial Switch */}
                <button 
                  onClick={handleConnectToggle}
                  disabled={vpnState === 'connecting' || vpnState === 'disconnecting'}
                  className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 shadow-2xl outline-none select-none cursor-pointer group ${
                    vpnState === 'connected'
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-102'
                      : vpnState === 'connecting'
                      ? 'bg-amber-950/40 border-amber-400 text-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-pulse'
                      : vpnState === 'disconnecting'
                      ? 'bg-rose-950/40 border-rose-400 text-rose-400'
                      : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-cyan-500/60 hover:text-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  <Lock className={`w-10 h-10 mb-2 transition-transform duration-500 ${
                    vpnState === 'connected' ? 'rotate-0 scale-110 text-emerald-400' : 'rotate-12 scale-100'
                  }`} />
                  <span className="font-display font-bold text-[11px] tracking-widest uppercase">
                    {vpnState === 'connected' ? 'CONNECTED' : vpnState === 'connecting' ? 'TUNNELING' : vpnState === 'disconnecting' ? 'CLOSING' : 'DISCONNECTED'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {vpnState === 'connected' ? 'CLICK TO DROP' : 'CLICK TO SHIELD'}
                  </span>
                </button>
              </div>

              {/* Real-time Connection Details */}
              <div className="flex-1 w-full flex flex-col justify-center text-center md:text-left space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">ACTIVE GATEWAY NODE</h3>
                  <p className="text-2xl font-light text-white font-display mt-1 flex items-center justify-center md:justify-start gap-2">
                    <span>{selectedServer.flag}</span>
                    <span>{selectedServer.city}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">GATEWAY IP</div>
                    <div className="text-xs font-mono font-medium text-slate-300 mt-0.5">{selectedServer.ip}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">SESSION DURATION</div>
                    <div className="text-xs font-mono font-medium text-cyan-400 mt-0.5">
                      {vpnState === 'connected' ? (
                        `${Math.floor(stats.duration / 3600).toString().padStart(2, '0')}:${Math.floor((stats.duration % 3600) / 60).toString().padStart(2, '0')}:${(stats.duration % 60).toString().padStart(2, '0')}`
                      ) : (
                        '00:00:00'
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Enforcing AES-256 / WireGuard DNS tunnel encryption layers</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics stats grid */}
            <div className="grid grid-cols-3 gap-3 w-full mt-6 pt-5 border-t border-slate-800/60 text-center">
              <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center">
                  <ArrowDown className="w-2.5 h-2.5 text-emerald-400 mr-1" /> DOWNLINK
                </div>
                <div className="text-sm font-mono text-emerald-400 font-bold">{vpnState === 'connected' ? formatSpeed(stats.currentSpeedDown) : '0.0 Kb/s'}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{formatBytes(stats.bytesReceived)}</div>
              </div>

              <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center">
                  <ArrowUp className="w-2.5 h-2.5 text-blue-400 mr-1" /> UPLINK
                </div>
                <div className="text-sm font-mono text-blue-400 font-bold">{vpnState === 'connected' ? formatSpeed(stats.currentSpeedUp) : '0.0 Kb/s'}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{formatBytes(stats.bytesSent)}</div>
              </div>

              <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center">
                  <Activity className="w-2.5 h-2.5 text-cyan-400 mr-1" /> LATENCY
                </div>
                <div className="text-sm font-mono text-white font-bold">{vpnState === 'connected' ? `${stats.ping} ms` : 'N/A'}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Jitter: &plusmn;2ms</div>
              </div>
            </div>
          </div>


          {/* Dynamic Sandbox Selector Tabs */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800/60 w-full">
            <button 
              onClick={() => setActiveTab('proxy')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'proxy' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Real Proxy Browser
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'audit' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Site SSL Scanner
            </button>
            <button 
              onClick={() => setActiveTab('anonymity')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'anonymity' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Anonymity Vectors
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="bg-[#070E1E]/80 border border-slate-800/60 rounded-2xl p-5 flex-1 flex flex-col justify-between backdrop-blur-md shadow-2xl min-h-[300px]">
            
            {/* TAB 1: REAL PROXY BROWSER */}
            {activeTab === 'proxy' && (
              <div className="flex-1 flex flex-col space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    SECURE REGIONAL PROXY TUNNEL
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Route real-time HTTP traffic through our Express Server proxy. This handles target fetching and injects an active encrypted banner.
                  </p>
                </div>

                <form onSubmit={handleProxyGo} className="flex gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center">
                    <span className="text-slate-500 text-xs font-mono mr-1 select-none">GET</span>
                    <input 
                      type="text" 
                      placeholder="e.g. wikipedia.org"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="bg-transparent border-none text-xs text-slate-200 outline-none w-full focus:ring-0 p-0 font-mono"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isProxyLoading}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {isProxyLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                    Tunnel
                  </button>
                </form>

                {/* Proxy browser simulation iframe container */}
                <div className="flex-1 min-h-[180px] bg-slate-950 rounded-xl border border-slate-800 relative flex flex-col overflow-hidden">
                  
                  {activeIframeUrl ? (
                    <div className="w-full h-full flex flex-col">
                      <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-800 flex items-center justify-between">
                        <span className="font-mono text-cyan-400 truncate max-w-[280px]">Proxy Link: {activeIframeUrl}</span>
                        <a href={activeIframeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                          Open in Tab <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <iframe 
                        src={activeIframeUrl} 
                        className="w-full flex-1 border-none bg-white"
                        title="Proxy Sandbox"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                      <Shield className="w-8 h-8 text-slate-700 mb-2" />
                      <h4 className="text-xs font-semibold text-slate-400">Tunnel Session Sandbox</h4>
                      <p className="text-[10px] mt-1 max-w-[280px]">
                        {vpnState === 'connected' 
                          ? 'Enter a website above and press Tunnel to securely surf via your selected VPN node.' 
                          : 'Establish an active VPN connection first to unlock browsing routes.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Historial log */}
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 overflow-x-auto py-1">
                  <span className="font-bold shrink-0">Recent Proxies:</span>
                  {proxyHistory.map((h, idx) => (
                    <button 
                      key={h.id} 
                      onClick={() => {
                        setProxyUrl(h.url);
                        setActiveIframeUrl(`/api/proxy?url=${encodeURIComponent(h.url)}`);
                      }}
                      className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded hover:border-slate-700 transition-colors font-mono shrink-0"
                    >
                      {h.url.replace('https://', '').replace('http://', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SITE SECURITY AUDIT SCANNER */}
            {activeTab === 'audit' && (
              <div className="flex-1 flex flex-col space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    LIVE SSL & SECURITY HEADERS SCANNER
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Evaluate any host URL for cryptographic standards, secure cookies, strict HSTS compliance, and common clickjacking defense headers.
                  </p>
                </div>

                <form onSubmit={handleRunSecurityAudit} className="flex gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center">
                    <span className="text-slate-500 text-xs font-mono mr-1 select-none">AUDIT</span>
                    <input 
                      type="text" 
                      placeholder="e.g. news.ycombinator.com"
                      value={auditInputUrl}
                      onChange={(e) => setAuditInputUrl(e.target.value)}
                      className="bg-transparent border-none text-xs text-slate-200 outline-none w-full focus:ring-0 p-0 font-mono"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isAuditing}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Scan'}
                  </button>
                </form>

                {auditError && (
                  <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400">
                    {auditError}
                  </div>
                )}

                {/* Audit results display */}
                {auditReport ? (
                  <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5 overflow-y-auto no-scrollbar max-h-[220px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 truncate max-w-[200px]">{auditReport.url}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{auditReport.ipAddress}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                          auditReport.securityScore >= 70 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}>
                          SCORE: {auditReport.securityScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/60">
                        <span className="text-slate-400">SSL Valid:</span>
                        <span className="font-mono text-emerald-400">YES</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/60">
                        <span className="text-slate-400">TLS Layer:</span>
                        <span className="font-mono text-cyan-400">{auditReport.tlsVersion}</span>
                      </div>
                    </div>

                    {/* Headers validation checkboxes */}
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Security Headers Present</h5>
                      <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                        <div className={`p-1 rounded flex items-center justify-between ${auditReport.headersPresent.hsts ? 'bg-emerald-950/30 text-emerald-400' : 'bg-rose-950/30 text-rose-400'}`}>
                          <span>HSTS</span>
                          <span>{auditReport.headersPresent.hsts ? '✓' : '✗'}</span>
                        </div>
                        <div className={`p-1 rounded flex items-center justify-between ${auditReport.headersPresent.csp ? 'bg-emerald-950/30 text-emerald-400' : 'bg-rose-950/30 text-rose-400'}`}>
                          <span>CSP</span>
                          <span>{auditReport.headersPresent.csp ? '✓' : '✗'}</span>
                        </div>
                        <div className={`p-1 rounded flex items-center justify-between ${auditReport.headersPresent.xfo ? 'bg-emerald-950/30 text-emerald-400' : 'bg-rose-950/30 text-rose-400'}`}>
                          <span>X-Frame</span>
                          <span>{auditReport.headersPresent.xfo ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remediations list */}
                    {auditReport.issues.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/60">
                        <h5 className="text-[10px] font-bold text-rose-400 uppercase">Vulnerability Vectors Identified</h5>
                        {auditReport.issues.map((iss, i) => (
                          <div key={i} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {iss.title}
                              </span>
                              <span className="text-[8px] uppercase px-1 bg-rose-950 text-rose-300 font-mono rounded">{iss.severity}</span>
                            </div>
                            <p className="text-[9px] text-slate-400">{iss.description}</p>
                            <p className="text-[9px] text-emerald-400 font-mono"><strong>Fix:</strong> {iss.remediation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                    <ShieldAlert className="w-6 h-6 text-slate-700 mb-1.5" />
                    <p className="text-xs font-semibold text-slate-400">Run security scan on any address</p>
                    <p className="text-[9px] text-slate-500 max-w-[240px] mt-0.5">We will query the SSL layers and response headers directly from Express.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ANONYMITY VECTORS */}
            {activeTab === 'anonymity' && (
              <div className="flex-1 flex flex-col space-y-3.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    ANONYMITY & LEAK INTEGRITY VECTORS
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your simulated connection exposure parameters. Activating the VPN protects you from WebRTC leaks, DNS leaking, and IP logging.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                    
                    {/* Native IP exposure */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Native IP Address:</span>
                      <span className="font-mono font-medium text-slate-300">{userIpInfo.originalIp}</span>
                    </div>

                    {/* Virtual IP exposure */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Proxied Virtual IP:</span>
                      <span className={`font-mono font-bold ${vpnState === 'connected' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {userIpInfo.currentIp}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Geographic Location:</span>
                      <span className="font-mono text-slate-300">{userIpInfo.location}</span>
                    </div>

                    {/* WebRTC Leak Status */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">WebRTC Protection:</span>
                      <span className={`font-mono font-bold ${vpnState === 'connected' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                        {vpnState === 'connected' ? '✓ SECURED' : '⚠ VULNERABLE'}
                      </span>
                    </div>

                    {/* DNS Leak Protection */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">DNS Leaks:</span>
                      <span className={`font-mono font-bold ${vpnState === 'connected' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                        {vpnState === 'connected' ? '✓ ENCRYPTED' : '⚠ LEAKING'}
                      </span>
                    </div>
                  </div>

                  {/* DNS Servers Pool info */}
                  <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40 text-[10px] space-y-1">
                    <div className="text-slate-500 uppercase font-bold tracking-wider">RESOLVING DNS PATHWAYS</div>
                    <p className="font-mono text-slate-300">{userIpInfo.dnsServer}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-tr from-cyan-950/20 to-indigo-950/20 p-3 rounded-xl border border-cyan-500/20 text-[10px] text-cyan-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Cryptographic Isolation:</strong> All virtual interfaces use ephemeral private tunnels. DNS resolving is handled by our zero-knowledge network nodes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>


        {/* ================= COLUMN 3: Cryto Inspect & Gemini Chat (cols 3) ================= */}
        <section id="crypto-and-advisor" className="lg:col-span-3 flex flex-col space-y-6 h-[calc(100vh-140px)] min-h-[580px]">
          
          {/* Packet Cryto Inspector Console */}
          <div className="bg-[#070E1E]/80 border border-slate-800/60 rounded-2xl p-4 flex flex-col overflow-hidden backdrop-blur-md shadow-2xl h-1/2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 shrink-0">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              TUNNEL PACKET CRYPTO-INSPECTOR
            </h3>
            
            <p className="text-[10px] text-slate-500 leading-normal mb-3 shrink-0">
              Live inspection of packets passing through regional virtual interfaces.
            </p>

            {/* Custom packet builder tool */}
            <form onSubmit={handleCustomPacketEncrypt} className="flex gap-1 mb-2.5 shrink-0">
              <input 
                type="text" 
                placeholder="Encrypt custom message..."
                value={customPacketInput}
                onChange={(e) => setCustomPacketInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-200 placeholder-slate-600 outline-none w-full focus:ring-0 focus:border-slate-700 font-mono"
              />
              <button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
              >
                Inject
              </button>
            </form>

            {/* Packet stream console log */}
            <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-900 p-2.5 font-mono text-[9px] overflow-y-auto space-y-2 no-scrollbar">
              {packetStream.map((p) => (
                <div key={p.id} className="border-b border-slate-900/60 pb-1.5 last:border-b-0">
                  <div className="flex items-center justify-between text-slate-500 text-[8px] mb-0.5">
                    <span className={p.direction === 'client-to-server' ? 'text-cyan-400' : 'text-blue-400'}>
                      {p.direction === 'client-to-server' ? '▶ CLIENT_OUT' : '◀ SERVER_IN'}
                    </span>
                    <span>{p.algorithm}</span>
                  </div>

                  <div className="text-slate-400 truncate">
                    <span className="text-slate-600">RAW: </span>&quot;{p.originalText}&quot;
                  </div>

                  <div className="text-emerald-400 truncate flex items-center justify-between mt-0.5">
                    <div>
                      <span className="text-slate-600">CIPHER: </span>
                      <span className="break-all">{p.encryptedText.slice(0, 20)}...</span>
                    </div>
                    {p.decrypted ? (
                      <span className="text-[7px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-1 rounded">DECRYPTED</span>
                    ) : (
                      <span className="text-[7px] bg-rose-950/40 text-rose-400 border border-rose-500/30 px-1 rounded animate-pulse">TUNNELED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* AI Security Advisor Chat panel */}
          <div className="bg-[#070E1E]/80 border border-slate-800/60 rounded-2xl p-4 flex flex-col overflow-hidden backdrop-blur-md shadow-2xl h-1/2">
            
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                SECURITY ADVISOR TERMINAL
              </h3>
              <button 
                onClick={runSpeedTest}
                className="text-[9px] bg-indigo-950 hover:bg-indigo-900 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono font-bold transition-all"
              >
                ⚡ Speed Test
              </button>
            </div>

            {/* Chat message display area */}
            <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-900 p-3 overflow-y-auto space-y-2.5 text-xs no-scrollbar">
              {chatMessages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="text-center font-mono text-[9px] text-slate-500 bg-slate-900/40 py-1 px-2 rounded border border-slate-900/60">
                      [{msg.timestamp}] {msg.text}
                    </div>
                  );
                }
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] text-slate-500 font-mono mb-0.5">
                      {isUser ? 'Operator' : 'AI Sec Advisor'} • {msg.timestamp}
                    </span>
                    <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed break-words text-[11px] ${
                      isUser 
                        ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 rounded-tr-none font-mono' 
                        : 'bg-slate-900/80 text-slate-300 border border-slate-800 rounded-tl-none font-sans'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChat} className="flex gap-1.5 mt-2.5 shrink-0">
              <input 
                type="text" 
                placeholder="Ask about ciphers, DNS leak protection..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 outline-none w-full focus:ring-1 focus:ring-cyan-500/30 focus:border-slate-700"
              />
              <button 
                type="submit" 
                disabled={isChatSending}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold p-1.5 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                {isChatSending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* Footer System Status Bar */}
      <footer className="px-6 py-3 bg-[#030712] border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 shrink-0 z-10 relative">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-1.5 h-1.5 rounded-full ${vpnState === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>Tunnel Interface: {vpnState === 'connected' ? 'utun8 (TUN_DEV)' : 'NONE (Native routing)'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Encrypted Tunnel: 256-bit {selectedProtocol.id === 'wireguard' ? 'ChaCha20-Poly1305' : 'AES-GCM'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Active Port: {selectedProtocol.port} (UDP)</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:text-slate-300 cursor-pointer">Protocol: {selectedProtocol.name}</span>
          <span className="hover:text-slate-300 cursor-pointer">Support Helpdesk</span>
          <span className="text-slate-800 font-mono">v3.5.1-Prod</span>
        </div>
      </footer>
    </div>
  );
}
