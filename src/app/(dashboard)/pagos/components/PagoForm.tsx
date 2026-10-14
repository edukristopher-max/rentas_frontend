"use client";

import { useState, useEffect } from "react";
import { CreatePagoDto } from "@/types/pago";
import { createPago } from "@/services/pagos.service";
import { Deuda } from "@/types/deuda";
import { getDeudas } from "@/services/deudas.service";

interface PagoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PagoForm({ onSuccess, onCancel }: PagoFormProps) {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePagoDto>({
    deudaId: 0,
    montoPagado: 0,
    metodoPago: "Efectivo",
    cajero: "Caja 01", // Default temporal
    notas: "",
  });

  useEffect(() => {
    const fetchDeudas = async () => {
      try {
        const allDeudas = await getDeudas();
        // Solo mostrar deudas que no estén pagadas ni fraccionadas totalmente
        const deudasPendientes = allDeudas.filter(d => d.estado === "Pendiente" || d.estado === "Vencida");
        setDeudas(deudasPendientes);
      } catch (err) {
        console.error("Error cargando deudas", err);
      }
    };
    fetchDeudas();
  }, []);

  const handleChangeDeuda = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deudaId = parseInt(e.target.value);
    const deudaSeleccionada = deudas.find(d => d.id === deudaId);

    setFormData(prev => ({
      ...prev,
      deudaId,
      // Autocompletar el monto con el Total a Pagar
      montoPagado: deudaSeleccionada ? deudaSeleccionada.totalPagar : 0
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deudaId) {
      setError("Debes seleccionar una deuda para pagar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPago(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  const deudaSeleccionada = deudas.find(d => d.id === formData.deudaId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-municipal-950 flex items-center gap-2">
        <span className="text-green-600">💵</span> Procesar Pago
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">Deuda a Pagar (Solo Pendientes/Vencidas)</label>
          <select
            name="deudaId"
            value={formData.deudaId}
            onChange={handleChangeDeuda}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-3 border bg-gray-50"
            required
          >
            <option value={0} disabled>-- Selecciona una Deuda --</option>
            {deudas.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.contribuyenteNombre}] - {d.concepto} (S/ {d.totalPagar.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {deudaSeleccionada && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
             <p className="text-sm text-blue-800 font-medium mb-1">Resumen de Deuda:</p>
             <p className="text-xs text-blue-600">Contribuyente: {deudaSeleccionada.contribuyenteNombre}</p>
             <p className="text-xs text-blue-600">Monto Base: S/{deudaSeleccionada.montoOriginal.toFixed(2)} | Mora: S/{deudaSeleccionada.mora.toFixed(2)} | Dcto: S/{deudaSeleccionada.descuento.toFixed(2)}</p>
             <p className="text-lg font-bold text-blue-900 mt-2">Total Deuda: S/ {deudaSeleccionada.totalPagar.toFixed(2)}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto Pagado (S/)</label>
            <input
              type="number"
              step="0.01"
              name="montoPagado"
              value={formData.montoPagado}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border font-bold text-green-700 text-lg bg-green-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring focus:ring-municipal-600 focus:ring-opacity-50 p-2.5 border"
              required
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="Yape/Plin">Yape / Plin</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Cajero / Taquilla</label>
            <input
              type="text"
              name="cajero"
              value={formData.cajero}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border"
              required
            />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Notas u Observaciones (Opcional)</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-municipal-600 focus:ring p-2 border text-sm"
            />
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors flex items-center shadow-md"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Pago"}
          </button>
        </div>
      </form>
    </div>
  );
}
