const rowData = [
        formData.canalIngreso || "CORREO ELECTRÓNICO", // A: CANAL DE INGRESO
        "",                                           // B: MES (Fórmula)
        formData.fechaAsignacion || "",               // C: FECHA ASIGNACION
        formData.correoFuncionario || "",             // D: CORREO FUNCIONARIO
        formData.funcionario || "",                   // E: FUNCIONARIO ENCARGADO
        formData.asunto || "",                        // F: ASUNTO CORREO
        formData.fechaCorreo || "",                   // G: FECHA CORREO
        formData.contribuyente || "",                 // H: CONTRIBUYENTE
        formData.correoSolicitante || "",             // I: CORREO SOLICITANTE
        formData.tipoRenta || "",                     // J: TIPO DE RENTA
        formData.tipoRentaOtro || "",                 // K: TIPO RENTA OTRO
        formData.tipoTramite || "",                   // L: TIPO DE TRAMITE
        formData.item || "",                          // M: ITEM
        formData.placa || "",                         // N: PLACA
        formData.fechaRespuesta || "",                // O: FECHA RESPUESTA
        formData.tipoRespuesta || "",                 // P: TIPO DE RESPUESTA
        formData.noSadeSalida || "",                  // Q: No SADE SALIDA
        formData.observaciones || "",                 // R: OBSERVACIONES
        formData.prelacionLegal || "",                // S: PRELACION LEGAL
        formData.fechaVencimiento || ""               // T: FECHA DE VENCIMIENTO
        // U hasta Z: Se omiten del formulario porque son fórmulas automáticas de la hoja
      ];
