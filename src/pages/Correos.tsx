export function FormularioDeCorreos({ onEnviar, onCancelar }: { onEnviar: (datos: any) => void; onCancelar: () => void }) {
  const [formData, setFormData] = useState({
    canalIngreso: "CORREO ELECTRÓNICO",
    mes: "OCTUBRE",
    fechaAsignacion: "",
    correoFuncionarioEncargado: "respuestavur@valledelcauca.gov.co",
    funcionarioEncargado: "",
    asuntoCorreo: "",
    fechaCorreo: "",
    contribuyenteSolicitante: "",
    correoSolicitante: "",
    tipoTramite: ""
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onEnviar(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Canal de Ingreso</label>
          <input
            type="text"
            name="canalIngreso"
            value={formData.canalIngreso}
            disabled
            className="w-full p-2 border rounded bg-muted text-muted-foreground cursor-not-allowed text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mes</label>
          <select
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          >
            {["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Correo (Origen)</label>
          <input
            type="date"
            name="fechaCorreo"
            value={formData.fechaCorreo}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Asignación</label>
          <input
            type="date"
            name="fechaAsignacion"
            value={formData.fechaAsignacion}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contribuyente / Solicitante</label>
          <input
            type="text"
            name="contribuyenteSolicitante"
            value={formData.contribuyenteSolicitante}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo Solicitante</label>
          <input
            type="email"
            name="correoSolicitante"
            value={formData.correoSolicitante}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Funcionario Encargado</label>
          <input
            type="text"
            name="funcionarioEncargado"
            value={formData.funcionarioEncargado}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo Funcionario</label>
          <input
            type="email"
            name="correoFuncionarioEncargado"
            value={formData.correoFuncionarioEncargado}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm bg-background"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Trámite</label>
        <select
          name="tipoTramite"
          value={formData.tipoTramite}
          onChange={handleChange}
          className="w-full p-2 border rounded text-sm bg-background"
          required
        >
          <option value="">Seleccione un trámite</option>
          <option value="Liquidación de Boleta Fiscal">Liquidación de Boleta Fiscal</option>
          <option value="Petición de Herencia">Petición de Herencia</option>
          <option value="Radicación Orden Judicial">Radicación Orden Judicial</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Asunto del Correo</label>
        <textarea
          name="asuntoCorreo"
          value={formData.asuntoCorreo}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded text-sm bg-background resize-none"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancelar} className="px-4 py-2 border rounded text-sm hover:bg-slate-50">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          Guardar Registro
        </button>
      </div>
    </form>
  );
}
