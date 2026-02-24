import { Calendar, Clock, MapPin } from 'lucide-react';
import { RSVPForm } from '../components/RSVPForm';

export function Home() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans selection:bg-white/20">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Column: Event Details */}
                <div className="flex flex-col space-y-8 pr-0 lg:pr-8">
                    <div>
                        <p className="text-[#a1a1aa] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                            Convite Exclusivo
                        </p>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1]">
                            Saia da <br />
                            <span className="italic font-light text-[#d4d4d8]">Torre</span>
                        </h1>
                    </div>

                    <p className="text-[#a1a1aa] text-base leading-relaxed max-w-md">
                        Um evento transformador projetado para quebrar barreiras e expandir seus horizontes. Confirme sua presença e prepare-se para uma nova perspectiva.
                    </p>

                    <div className="h-px w-full bg-[#27272a] my-4" />

                    <ul className="space-y-4">
                        <li className="flex items-center space-x-4 text-[#d4d4d8]">
                            <Calendar className="w-5 h-5 text-[#71717a] shrink-0" />
                            <span className="text-sm">06/03/2026</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[#d4d4d8]">
                            <Clock className="w-5 h-5 text-[#71717a] shrink-0" />
                            <span className="text-sm">18h</span>
                        </li>
                        <li className="flex items-start space-x-4 text-[#d4d4d8]">
                            <MapPin className="w-5 h-5 text-[#71717a] shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed text-left">Na loja Zem Multimarcas<br />R. Tesouro, 355 - Vale do Sol, Campo Verde - MT</span>
                        </li>
                    </ul>
                </div>

                {/* Right Column: Form Card */}
                <div className="w-full relative flex lg:justify-end">
                    <RSVPForm />
                </div>

            </div>
        </div>
    );
}
