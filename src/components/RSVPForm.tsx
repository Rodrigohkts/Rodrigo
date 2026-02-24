import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export function RSVPForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        cpf: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') formattedValue = maskCPF(value);
        if (name === 'phone') formattedValue = maskPhone(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() === '' || formData.phone.length < 14 || formData.cpf.length < 14) {
            setErrorMessage('Por favor, preencha todos os campos corretamente.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Verifica se CPF já existe
            const { data: existingUsers, error: searchError } = await supabase
                .from('invites')
                .select('cpf')
                .eq('cpf', formData.cpf)
                .limit(1);

            if (searchError) {
                throw searchError;
            }

            if (existingUsers && existingUsers.length > 0) {
                setErrorMessage('Este CPF já está cadastrado no evento.');
                setStatus('error');
                return;
            }

            const { error } = await supabase
                .from('invites')
                .insert([{ name: formData.name, phone: formData.phone, cpf: formData.cpf }]);

            if (error) throw error;
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            if (err.message?.includes('schema cache')) {
                setErrorMessage('O banco de dados (tabela invites) ainda não foi criado.');
            } else {
                setErrorMessage(err.message || 'Erro ao confirmar presença. Verifique sua conexão.');
            }
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-[#0a0a0b] glow-border border-transparent rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center py-16 space-y-6 text-center w-full max-w-md lg:w-[480px]">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative z-10">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                    <h2 className="font-serif text-3xl text-white">Confirmação Recebida</h2>
                    <p className="text-[#a1a1aa] max-w-[260px] text-sm leading-relaxed mx-auto">
                        Sua presença no evento Saia da Torre foi registrada com sucesso.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0b] glow-border border-transparent rounded-2xl p-8 sm:p-10 w-full max-w-md lg:w-[480px]">
            <div className="mb-8 relative z-10">
                <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Confirme sua Presença</h2>
                <p className="text-[#a1a1aa] text-sm md:text-[13px]">
                    Preencha seus dados abaixo para garantir seu lugar.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5 relative z-10">
                <div className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase pl-1">
                            Nome Completo
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Digite seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#131315] border border-[#27272a] hover:border-[#3f3f46] rounded-xl text-white text-[13px] placeholder:text-[#52525b] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase pl-1">
                            Telefone (WhatsApp)
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={15}
                            className="w-full px-4 py-3 bg-[#131315] border border-[#27272a] hover:border-[#3f3f46] rounded-xl text-white text-[13px] placeholder:text-[#52525b] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                        />
                    </div>

                    {/* CPF Input */}
                    <div className="space-y-2">
                        <label htmlFor="cpf" className="block text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase pl-1">
                            CPF
                        </label>
                        <input
                            id="cpf"
                            name="cpf"
                            type="text"
                            required
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleChange}
                            maxLength={14}
                            className="w-full px-4 py-3 bg-[#131315] border border-[#27272a] hover:border-[#3f3f46] rounded-xl text-white text-[13px] placeholder:text-[#52525b] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                        />
                    </div>
                </div>

                {status === 'error' && (
                    <div className="text-red-400 bg-red-400/10 p-3 rounded-xl text-xs border border-red-400/20">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={cn(
                        "group w-full py-[14px] mt-4 bg-[#ffffff] text-black font-semibold text-[13px] rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-[#e4e4e7]",
                        status === 'loading' && "opacity-80 cursor-not-allowed"
                    )}
                >
                    {status === 'loading' ? (
                        <span className="flex items-center space-x-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                            <span>Enviando...</span>
                        </span>
                    ) : (
                        <span className="flex items-center space-x-2">
                            <span className="tracking-wide">Confirmar Presença</span>
                            <ArrowRight className="w-[14px] h-[14px] transition-transform group-hover:translate-x-1" />
                        </span>
                    )}
                </button>

                <p className="text-center text-[10px] text-[#52525b] px-4 pt-1">
                    Seus dados estão seguros e serão utilizados apenas para a organização do evento.
                </p>
            </form>
        </div>
    );
}
