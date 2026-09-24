import React, { useState, useEffect } from 'react';
import { Users, Clock, Wallet, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LobbyPlayer {
  id: number;
  name: string;
  phone_number: string;
  balance: number;
  status: string;
  last_active: string;
}

interface LiveLobbyProps {
  theme?: 'dark' | 'light';
  currentPlayerId?: number;
}

export const LiveLobby: React.FC<LiveLobbyProps> = ({ theme = 'dark', currentPlayerId }) => {
  const isDark = theme === 'dark';
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([]);
  const [inLobby, setInLobby] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const fetchLobbyStatus = async () => {
    try {
      const token = localStorage.getItem('player_token');
      if (!token) return;

      // Get my status
      const statusRes = await fetch(`${API_BASE}/api/lobby/my-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setInLobby(statusData.in_lobby);
      }

      // Get all lobby players
      const lobbyRes = await fetch(`${API_BASE}/api/lobby/players`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (lobbyRes.ok) {
        const lobbyData = await lobbyRes.json();
        setLobbyPlayers(lobbyData.lobby_players || []);
      }
    } catch (error) {
      console.error('Failed to fetch lobby status:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinLobby = async () => {
    try {
      const token = localStorage.getItem('player_token');
      const res = await fetch(`${API_BASE}/api/lobby/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        await fetchLobbyStatus();
      }
    } catch (error) {
      console.error('Failed to join lobby:', error);
    }
  };

  const leaveLobby = async () => {
    try {
      const token = localStorage.getItem('player_token');
      const res = await fetch(`${API_BASE}/api/lobby/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        await fetchLobbyStatus();
      }
    } catch (error) {
      console.error('Failed to leave lobby:', error);
    }
  };

  useEffect(() => {
    fetchLobbyStatus();
    const interval = setInterval(fetchLobbyStatus, 5000); // Refresh every 5 seconds
    
    // Auto-join lobby if user is logged in and not already in lobby
    const autoJoin = async () => {
      const token = localStorage.getItem('player_token');
      if (token && !inLobby) {
        await joinLobby();
      }
    };
    
    autoJoin();
    
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (loading) {
    return (
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0E121B] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-center py-8">
          <Clock className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0E121B] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Live Lobby
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            {lobbyPlayers.length} Players
          </span>
        </div>
        
        {!inLobby ? (
          <button
            onClick={joinLobby}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Lobby
          </button>
        ) : (
          <button
            onClick={leaveLobby}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            Leave Lobby
          </button>
        )}
      </div>

      {/* Lobby Players */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {lobbyPlayers.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No players in lobby</p>
            <p className="text-xs mt-1">Join to start playing!</p>
          </div>
        ) : (
          <AnimatePresence>
            {lobbyPlayers.map((player) => {
              const isCurrentUser = player.id === currentPlayerId;
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-[#141A26] border-[#222C3E] hover:border-blue-500/50'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                  } ${isCurrentUser ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-[#182030]' : 'bg-white'
                      }`}>
                        <User className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {player.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-medium bg-yellow-500 text-yellow-900`}>
                            Waiting
                          </span>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {player.phone_number}
                          </span>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {getTimeAgo(player.last_active)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
                        <Wallet className="w-4 h-4" />
                        <span>KES {player.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Notice */}
      {lobbyPlayers.length > 0 && (
        <div className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className={isDark ? 'text-yellow-400' : 'text-yellow-700'}>
              Players marked "Waiting" are ready to play
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
