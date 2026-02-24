import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Guest {
    id: string;
    name: string;
    phone: string;
    cpf: string;
    created_at: string;
}

export function Guests() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGuests() {
            const { data, error } = await supabase
                .from('invites')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setGuests(data);
            }
            setLoading(false);
        }
        fetchGuests();
    }, []);

    return (
        <div className="min-h-screen bg-black p-6 sm:p-12 font-sans selection:bg-white/20">
            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl sm:text-4xl text-white">
                                Lista de Presença
                            </h1>
                            <p className="text-[#a1a1aa] text-sm mt-1">
                                {guests.length} {guests.length === 1 ? 'convidado confirmado' : 'convidados confirmados'}
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-all text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar ao Convite</span>
                    </Link>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></span>
                    </div>
                ) : guests.length === 0 ? (
                    <div className="text-center py-20 text-[#a1a1aa] bg-[#0a0a0b] glow-border border-transparent rounded-2xl relative w-full max-w-lg mx-auto">
                        <div className="relative z-10 p-10">
                            <p>Nenhum convidado confirmado ainda.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guests.map((guest) => (
                            <div
                                key={guest.id}
                                className="bg-[#0a0a0b] glow-border border-transparent rounded-2xl p-6 relative group"
                            >
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-medium text-lg leading-tight">{guest.name}</h3>
                                            <p className="text-[#71717a] text-xs mt-1 font-mono">{new Date(guest.created_at).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-emerald-400/80 shrink-0" />
                                    </div>

                                    <div className="pt-4 border-t border-[#1f1f22] space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#a1a1aa] text-[10px] uppercase tracking-wider font-bold">Telefone</span>
                                            <span className="text-[#d4d4d8] font-mono text-[13px]">{guest.phone}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#a1a1aa] text-[10px] uppercase tracking-wider font-bold">CPF</span>
                                            <span className="text-[#d4d4d8] font-mono text-[13px]">{guest.cpf}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
