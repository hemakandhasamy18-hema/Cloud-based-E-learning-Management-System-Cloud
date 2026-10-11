import React, { useRef } from "react";
import { Award, Download, ShieldCheck, Printer } from "lucide-react";

export default function CertificateTemplate({ certificate, onClose }) {
  const certificateRef = useRef(null);

  const handlePrint = () => {
    const printContent = certificateRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create temporary styles for printing
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #print-area, #print-area * { visibility: visible; }
        #print-area { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border: none; }
      }
    `;
    document.head.appendChild(printStyle);

    // Set wrapper ID and trigger print
    certificateRef.current.id = "print-area";
    window.print();
    
    // Cleanup
    certificateRef.current.id = "";
    document.head.removeChild(printStyle);
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform scale-100 transition-all">
        
        {/* Actions Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="text-violet-600 dark:text-violet-400" size={20} />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Academic Credential Issued</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl transition-all font-semibold shadow-md shadow-indigo-600/10"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>

        {/* Certificate Border Container */}
        <div className="p-8 md:p-12 overflow-x-auto bg-slate-50 dark:bg-slate-900/40">
          <div 
            ref={certificateRef}
            className="w-[800px] h-[550px] mx-auto bg-amber-50/20 dark:bg-slate-900 border-[16px] border-amber-800/10 dark:border-slate-800 p-8 flex flex-col justify-between items-center relative text-center select-none shadow-lg text-slate-800 dark:text-slate-100"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {/* Watermark/Corners */}
            <div className="absolute top-2 left-2 text-2xl text-amber-600/20">✦</div>
            <div className="absolute top-2 right-2 text-2xl text-amber-600/20">✦</div>
            <div className="absolute bottom-2 left-2 text-2xl text-amber-600/20">✦</div>
            <div className="absolute bottom-2 right-2 text-2xl text-amber-600/20">✦</div>

            {/* Inner gold frame border */}
            <div className="absolute inset-2 border border-amber-600/30 pointer-events-none" />

            {/* Header */}
            <div className="mt-4">
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-700/80 dark:text-amber-500/80">
                Cloud Academic Alliance - Verification ID: {certificate.id}
              </span>
              <h2 className="text-3xl font-extrabold tracking-wide uppercase text-amber-800 dark:text-amber-500 mt-2 font-display">
                Certificate of Completion
              </h2>
              <p className="text-xs italic text-slate-500 mt-1">This document verifies that</p>
            </div>

            {/* Recipient */}
            <div>
              <p className="text-4xl font-semibold bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent underline decoration-amber-600/20 decoration-wavy py-2 font-display">
                {certificate.studentName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                has successfully completed all lecture assignments, laboratory submissions, and final testing parameters required for the curriculum of:
              </p>
            </div>

            {/* Course Title */}
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none font-display">
                "{certificate.courseTitle}"
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                Under instruction of the Department of Cloud Computing & Virtualization Technology
              </p>
            </div>

            {/* Verification & Signatures */}
            <div className="w-full flex justify-between items-end px-12 mb-4">
              {/* Issuance details */}
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Issued</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{formattedDate}</p>
              </div>

              {/* Gold seal */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg text-white relative">
                  <ShieldCheck size={32} />
                  {/* Decorative ribbon edges */}
                  <div className="absolute top-14 w-4 h-8 bg-amber-600 rounded-b transform -rotate-12" />
                  <div className="absolute top-14 w-4 h-8 bg-amber-500 rounded-b transform rotate-12" />
                </div>
              </div>

              {/* Signature */}
              <div className="text-right border-t border-slate-300 dark:border-slate-800 pt-1 px-4">
                <p className="text-xs italic font-display text-slate-500">Dr. Amit Sharma</p>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Dean of Cloud Computing</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
