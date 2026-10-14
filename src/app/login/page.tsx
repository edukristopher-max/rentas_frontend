"use client";

import { useState } from "react";
import { authService } from "../../services/auth.service";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await authService.login({ correo, password });
      setMessage(`¡Bienvenido ${response.usuario.nombreUsuario}!`);
      router.push("/");
    } catch (err) {
      setError(true);
      if (isAxiosError(err) && err.response?.data?.mensaje) {
        setMessage(err.response.data.mensaje);
      } else {
        setMessage("Ocurrió un error al intentar iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Panel institucional */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-municipal-950 via-municipal-900 to-blue-700 text-white items-center justify-center">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-400/10"></div>
        <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-blue-300/10"></div>

        <div className="relative z-10 max-w-lg px-12">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl">🏛️</div>
                <span className="text-[9px] font-bold text-municipal-900">MUNICIPALIDAD</span>
              </div>
            </div>

            <div>
              <p className="text-blue-200 text-sm">Municipalidad</p>
              <h1 className="text-3xl font-bold">San Miguel</h1>
              <p className="text-blue-200 text-sm mt-1">Sistema de Rentas</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Gestión de rentas
            <span className="text-blue-300"> simple y eficiente.</span>
          </h2>

          <p className="text-blue-100 text-base mt-4 leading-relaxed">
            Administra contribuyentes, predios, tributos, pagos y deudas
            desde una sola plataforma municipal.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">✓</div>
              <div>
                <p className="font-semibold">Gestión centralizada</p>
                <p className="text-sm text-blue-200">Información organizada en un solo sistema.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">$</div>
              <div>
                <p className="font-semibold">Control de recaudación</p>
                <p className="text-sm text-blue-200">Consulta pagos, deudas e ingresos.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">↗</div>
              <div>
                <p className="font-semibold">Reportes municipales</p>
                <p className="text-sm text-blue-200">Información para una mejor gestión.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10">
            <p className="text-xs text-blue-200">
              © 2026 Municipalidad de San Miguel · Sistema de Rentas
            </p>
          </div>
        </div>
      </section>

      {/* Login */}
      <section className="flex-1 flex items-center justify-center px-5 py-4">
        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-municipal-900 text-white flex items-center justify-center text-4xl shadow-lg">🏛️</div>
            <h1 className="text-2xl font-bold text-municipal-900 mt-4">
              Municipalidad de San Miguel
            </h1>
            <p className="text-sm text-slate-500">Sistema de Rentas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-7">

            <div className="mb-5">
              <p className="text-sm font-medium text-blue-600 mb-2">SISTEMA DE RENTAS</p>
              <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
              <p className="text-slate-500 mt-2">
                Inicia sesión para acceder al sistema municipal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                  <input id="correo" name="correo" type="email"
                    value={correo} onChange={(e) => setCorreo(e.target.value)}
                    autoComplete="email" placeholder="Ingrese su correo electrónico" required
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                  <input id="password" name="password" type={showPassword ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" placeholder="Ingrese su contraseña" required
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />

                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100">
                    {showPassword ? "👁" : "🙈"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Recordarme
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  ¿Olvidó su contraseña?
                </a>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full rounded-xl bg-municipal-900 hover:bg-municipal-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2.5 transition shadow-lg shadow-blue-900/20">
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              {message && (
                <div className={`rounded-lg px-4 py-3 text-sm border ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                  {message}
                </div>
              )}
            </form>

            <div className="flex items-center gap-4 my-5">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400">ACCESO MUNICIPAL</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="flex gap-3">
                <div className="text-blue-600 text-lg">ℹ</div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">¿Problemas para ingresar?</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Comuníquese con el administrador del sistema para recuperar sus
                    credenciales de acceso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Sistema de Rentas Municipal · Versión 1.0
          </p>
        </div>
      </section>
    </div>
  );
}
