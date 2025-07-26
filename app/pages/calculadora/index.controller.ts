import { defineComponent, reactive, computed, watch, ref } from 'vue'
import jsonParams from './src/params.json'

/**
 * Controlador principal para la calculadora de costos de aeronaves
 * Maneja todos los cálculos financieros, inflación, depreciación y análisis de inversión
 * para operaciones de aeronaves comerciales.
 * 
 * Características principales:
 * - Cálculo dinámico de costos de mantenimiento basado en horas de vuelo seleccionadas
 * - Configuración de horas de vuelo mediante dropdown con opciones predefinidas
 * - Distribución automática de horas entre vuelos nacionales e internacionales
 * - Cálculos de inflación y depreciación para análisis de inversión a largo plazo
 * - Análisis de rentabilidad y beneficios fiscales
 */
export default defineComponent({
  name: 'calculadora',
  setup() {
    
    const params = jsonParams
    const factorS600HrsMttoDiscrepancias = 80000 / 600
    const factorS600HrsMttoInteriores = 20000 / 600

    /**
     * Opciones de horas de vuelo disponibles para selección
     * Extraídas del archivo de parámetros mtto_params.hrs
     * @type {Array<number>}
     */
    const horasOpciones = params.mtto_params.map(item => item.hrs)
    
    /**
     * Obtiene el costo de mantenimiento programado según las horas de vuelo seleccionadas
     * Busca en el array mtto_params la configuración que coincida con las horas especificadas
     * y retorna el costo correspondiente. Si no encuentra coincidencia, retorna el costo por defecto.
     * 
     * @param {number} horas - Horas de vuelo anuales (200, 300, 400, 500, 600)
     * @returns {number} Costo de mantenimiento programado anual en USD
     * 
     * @example
     * obtenerCostoMttoPorHoras(200) // Retorna 356600
     * obtenerCostoMttoPorHoras(400) // Retorna 381600
     * obtenerCostoMttoPorHoras(600) // Retorna 442600
     */
    const obtenerCostoMttoPorHoras = (horas: number) => {
      const mttoParam = params.mtto_params.find(item => item.hrs === horas)
      return mttoParam ? mttoParam.costo : params.costo_mtto_programado_total_anual
    }

    /**
     * Configuración para el cálculo de horas de vuelo por porcentaje
     * Permite distribuir las horas totales entre vuelos nacionales e internacionales
     */
    const horasConfig = reactive({
      horas_totales: params.hrs_vuelo_nacionales_anual + params.hrs_vuelo_extranjero_anual,
      porcentaje_hrs_nacionales: 60, // Porcentaje por defecto
      porcentaje_hrs_extranjero: 40  // Porcentaje por defecto
    })

    /**
     * Estado reactivo para mostrar/ocultar el panel de configuración avanzada
     */
    const showConfiguration = ref(false)

    /**
     * Estado reactivo para controlar la inclusión de costos opcionales
     */
    const costosOpcionales = reactive({
      incluir_capacitacion_pilotos: true,
      incluir_administracion: true,
      incluir_guardia_hangar: true
    })

    /**
     * Estado reactivo para mensajes de validación
     */
    const validationMessage = ref('')

    /**
     * Datos del formulario principal con todos los parámetros financieros
     * Incluye tasas, costos, horas de vuelo y configuraciones de inversión
     */
    const formData = reactive({
      // Años de inversión
      anos_inversion: params.anos_inversion,
      
      // Tasas y cambios
      tasa_cambio_usd_mxn: params.tasa_cambio_usd_mxn,
      tasa_inflacion_anual: params.tasa_inflacion_anual,
      tasa_inflacion_usa: params.tasa_inflacion_usa,
      tasa_depreciacion_anual: params.tasa_depreciacion_anual,
      
      // Horas de vuelo (se calcularán automáticamente)
      hrs_vuelo_nacionales_anual: params.hrs_vuelo_nacionales_anual,
      hrs_vuelo_extranjero_anual: params.hrs_vuelo_extranjero_anual,
      
      // Horas y precio de renta SAE
      horas_renta_sae: params.horas_renta_sae,
      precio_hr_renta: params.precio_hr_renta,
      
      // Costos de turbosina
      costo_turbocina_mex_lt: params.costo_turbocina_mex_lt,
      costo_turbocina_usa_gal: params.costo_turbocina_usa_gal,
      turbocina_mex_lt_hora: params.turbocina_mex_lt_hora,
      turbocina_usa_gal_hora: params.turbocina_usa_gal_hora,
      
      // Programa de motores
      programa_motor_anual: params.programa_motor_anual,
      montores_cantidad: params.montores_cantidad,
      
      // Mantenimiento - Costo inicial calculado dinámicamente según las horas totales + horas SAE
      costo_mtto_programado_total_anual: obtenerCostoMttoPorHoras(params.hrs_vuelo_nacionales_anual + params.hrs_vuelo_extranjero_anual + params.horas_renta_sae),
      
      // Reservas de mantenimiento
      reserva_mtto_programado_anual: params.reserva_mtto_programado_anual,
      
      // Capacitación y administración
      reserva_capacitacion_pilotos_anual: params.reserva_capacitacion_pilotos_anual,
      administracion_anual: params.administracion_anual,
      
      // Sueldos
      sueldo_piloto_pic_anual: params.sueldo_piloto_pic_anual,
      sueldo_piloto_sic_anual: params.sueldo_piloto_sic_anual,
      
      // Otros costos
      guardia_hangar_anual: params.guardia_hangar_anual,
      seguro_aeronave_anual: params.seguro_aeronave_anual,
      arrendamiento_anual: params.arrendamiento_anual,
      precio_venta_aeronave: params.precio_venta_aeronave
    })

    /**
     * Calcula las horas de vuelo nacionales e internacionales basándose en los porcentajes configurados
     * Esta función se ejecuta automáticamente cuando cambian los porcentajes o las horas totales
     */
    const calcularHorasPorPorcentaje = () => {
      const horasTotales = horasConfig.horas_totales || 0
      formData.hrs_vuelo_nacionales_anual = Math.round((horasTotales * horasConfig.porcentaje_hrs_nacionales) / 100)
      formData.hrs_vuelo_extranjero_anual = Math.round((horasTotales * horasConfig.porcentaje_hrs_extranjero) / 100)
    }

    /**
     * Actualiza los porcentajes de horas de vuelo y asegura que siempre sumen 100%
     * @param {string} tipo - Tipo de vuelo: 'nacionales' o 'extranjero'
     * @param {number} valor - Nuevo valor del porcentaje (0-100)
     */
    const actualizarPorcentaje = (tipo: 'nacionales' | 'extranjero', valor: number) => {
      // Limitar el valor entre 0 y 100
      valor = Math.max(0, Math.min(100, valor))
      
      if (tipo === 'nacionales') {
        horasConfig.porcentaje_hrs_nacionales = valor
        horasConfig.porcentaje_hrs_extranjero = 100 - valor
      } else {
        horasConfig.porcentaje_hrs_extranjero = valor
        horasConfig.porcentaje_hrs_nacionales = 100 - valor
      }
    }

    /**
     * Actualiza las horas totales y el costo de mantenimiento cuando se selecciona una opción del dropdown
     * Esta función se ejecuta cuando el usuario cambia la selección de horas de vuelo anuales.
     * Automáticamente actualiza tanto la configuración de horas como el costo de mantenimiento
     * correspondiente, lo que dispara la recalculación de todos los costos dependientes.
     * También valida y ajusta las Horas Renta SAE si es necesario.
     * 
     * @param {number} horas - Nuevo valor de horas totales anuales seleccionado
     * 
     */
    const actualizarHorasTotales = (horas: number) => {
      horasConfig.horas_totales = horas
      // El costo de mantenimiento se actualizará automáticamente a través del watcher
      
      // Validar y ajustar Horas Renta SAE si es necesario
      const maxHoras = getMaxHoras()
      const maxHorasRentaSae = maxHoras - horas
      
      if (maxHorasRentaSae <= 0) {
        if (formData.horas_renta_sae > 0) {
          validationMessage.value = `Las Horas Renta SAE se han restablecido a 0 porque las horas totales anuales (${horas}) alcanzan o superan el máximo permitido de ${maxHoras} horas.`
          formData.horas_renta_sae = 0
          setTimeout(() => {
            validationMessage.value = ''
          }, 15000)
        }
      } else if (formData.horas_renta_sae > maxHorasRentaSae) {
        // Ajustar al múltiplo de 100 más cercano que no supere el máximo
        const adjustedMax = Math.floor(maxHorasRentaSae / 100) * 100
        validationMessage.value = `Las Horas Renta SAE se han ajustado de ${formData.horas_renta_sae} a ${adjustedMax} (múltiplo de 100 más cercano) para no superar el máximo de ${maxHoras} horas totales.`
        formData.horas_renta_sae = adjustedMax
        setTimeout(() => {
          validationMessage.value = ''
        }, 15000)
      }
    }

    // Watchers para calcular automáticamente las horas basándose en porcentajes
    watch([() => horasConfig.horas_totales, () => horasConfig.porcentaje_hrs_nacionales, () => horasConfig.porcentaje_hrs_extranjero], () => {
      calcularHorasPorPorcentaje()
    }, { immediate: true })

    /**
     * Calcula el costo del paquete de horas de vuelo por año con inflación aplicada
     * @returns {Array} Array de objetos con costo por año, incluyendo incrementos por inflación
     */
    const paqueteHrsVuelo = computed(() => {
      const hrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (hrs === 0) return []

      const costoHr = 3500
      const years = formData.anos_inversion
      const costoTotalAnual = costoHr * hrs
      const inflationRate = formData.tasa_inflacion_anual / 100
      const yearlyCosts = []

      for (let year = 1; year <= years; year++) {
        let costWithInflation: number
        
        if (year === 1) {
          // Primer año: sin inflación
          costWithInflation = costoTotalAnual
        } else {
          // Años subsecuentes: aplicar inflación
          costWithInflation = costoTotalAnual * Math.pow(1 + inflationRate, year - 1)
        }

        yearlyCosts.push({
          anio: year,
          costo: costWithInflation,
          costoFormateado: formatCurrencyText(costWithInflation),
          incremento: year === 1 ? 0 : costWithInflation - costoTotalAnual,
          incrementoFormateado: year === 1 ? '$0.00' : formatCurrencyText(costWithInflation - costoTotalAnual)
        })
      }

      return yearlyCosts
    })

    /**
     * Calcula el costo total del paquete de horas de vuelo para todos los años
     * @returns {number} Suma total de todos los costos anuales del paquete
     */
    const paqueteHrsVueloTotal = computed(() => {
      return paqueteHrsVuelo.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
    })

    /**
     * Calcula el costo administrativo por hora de vuelo
     * Incluye administración, capacitación de pilotos y sueldos (según checkboxes habilitados)
     * @returns {number} Costo administrativo por hora
     */
    const calc_costo_administrativo_hr = computed(() => {
      const administracion = costosOpcionales.incluir_administracion ? formData.administracion_anual : 0
      const capacitacion = costosOpcionales.incluir_capacitacion_pilotos ? formData.reserva_capacitacion_pilotos_anual : 0
      const costoAdministrativo = administracion + capacitacion + formData.sueldo_piloto_pic_anual + formData.sueldo_piloto_sic_anual
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return (costoAdministrativo * formData.anos_inversion) / (totalHrs * formData.anos_inversion)
    })

    /**
     * Calcula la reserva anual para mantenimiento de discrepancias
     * Basado en un factor fijo por hora de vuelo
     * @returns {number} Reserva anual para discrepancias
     */
    const calc_reserva_mtto_discrepancias_anual = computed(() => {
      return factorS600HrsMttoDiscrepancias * (parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString()))
    })

    /**
     * Calcula la reserva anual para mantenimiento de interiores
     * Basado en un factor fijo por hora de vuelo
     * @returns {number} Reserva anual para interiores
     */
    const calc_reserva_mtto_interiores_anual = computed(() => {
      return factorS600HrsMttoInteriores * (parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString()))
    })

    /**
     * Calcula la reserva total anual de mantenimiento
     * Suma todas las reservas: programado, discrepancias e interiores
     * @returns {number} Reserva total anual de mantenimiento
     */
    const calc_reserva_mtto_total_anual = computed(() => {
      return formData.reserva_mtto_programado_anual + calc_reserva_mtto_discrepancias_anual.value + calc_reserva_mtto_interiores_anual.value
    })

    /**
     * Calcula el costo de mantenimiento programado basado en horas totales + horas SAE
     * @returns {number} Costo de mantenimiento programado
     */
    const calc_costo_mtto_programado = computed(() => {
      const horasTotales = horasConfig.horas_totales || 0
      const horasRentaSae = formData.horas_renta_sae || 0
      const horasCompletas = horasTotales + horasRentaSae
      return obtenerCostoMttoPorHoras(horasCompletas)
    })

    // Watcher para actualizar automáticamente el costo de mantenimiento
    watch([() => horasConfig.horas_totales, () => formData.horas_renta_sae], () => {
      formData.costo_mtto_programado_total_anual = calc_costo_mtto_programado.value
    }, { immediate: true })

    /**
     * Calcula el costo total de mantenimiento programado con inflación aplicada
     * Actualiza automáticamente la reserva de mantenimiento programado
     * @returns {number} Costo total de mantenimiento con inflación
     */
    const costo_mtto_programado_total_anual_inflacion = computed(() => {
      if (!costoMttoInflacionPorAnio?.value) {
        return 0
      }

      const costoConInflacionCalculado = costoMttoInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)

      formData.reserva_mtto_programado_anual = costoConInflacionCalculado / formData.anos_inversion
      formattedData.reserva_mtto_programado_anual = formatCurrency(formData.reserva_mtto_programado_anual)
      
      return costoConInflacionCalculado
    })

    /**
     * Calcula el costo de mantenimiento con inflación año por año
     * Aplica la tasa de inflación de USA al mantenimiento programado
     * @returns {Array} Array de objetos con costo por año incluyendo año 0 (sin inflación)
     */
    const costoMttoInflacionPorAnio = computed(() => {
      const years = formData.anos_inversion
      const baseCost = formData.costo_mtto_programado_total_anual / years
      const inflationUSARate = formData.tasa_inflacion_usa / 100
      const yearlyCosts = []

      // Add year 0 (base cost without inflation)
      yearlyCosts.push({
        anio: 0,
        costo: baseCost,
        costoFormateado: formatCurrency(baseCost),
        incremento: 0,
        incrementoFormateado: formatCurrency(0)
      })

      // Add years 1 to N with inflation
      for (let year = 1; year <= years - 1; year++) {
        const inflatedCost: number = (yearlyCosts[year - 1]?.costo || 0) * (1 + inflationUSARate)
        yearlyCosts.push({
          anio: year,
          costo: inflatedCost,
          costoFormateado: formatCurrency(inflatedCost),
          incremento: inflatedCost - baseCost,
          incrementoFormateado: formatCurrency(inflatedCost - baseCost)
        })
      }

      return yearlyCosts
    })

    /**
     * Formatea un valor numérico como string para campos de entrada
     * @param {number} value - Valor numérico a formatear
     * @returns {string} Valor formateado como string
     */
    const formatCurrency = (value: number): string => {
      if (isNaN(value) || value === null || value === undefined) return '0'
      return value.toString()
    }

    /**
     * Formatea un valor numérico como moneda para display
     * @param {number|string} value - Valor a formatear
     * @returns {string} Valor formateado como moneda (ej: "1,234.56")
     */
    const formatCurrencyText = (value: number | string): string => {
      if (isNaN(Number(value)) || value === null || value === undefined) return '0.00'
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(value))
    }

    /**
     * Convierte un string de moneda a número
     * @param {string} value - String con formato de moneda
     * @returns {number} Valor numérico extraído
     */
    const parseCurrency = (value: string): number => {
      const number = parseFloat(value)
      return isNaN(number) ? 0 : number
    }

    /**
     * Datos formateados para display en la interfaz
     * Mantiene los valores como strings para los campos de entrada
     */
    const formattedData = reactive({
      tasa_cambio_usd_mxn: params.tasa_cambio_usd_mxn.toString(),
      tasa_inflacion_usa: params.tasa_inflacion_usa.toString(),
      tasa_depreciacion_anual: params.tasa_depreciacion_anual.toString(),
      costo_turbocina_mex_lt: params.costo_turbocina_mex_lt.toString(),
      costo_turbocina_usa_gal: params.costo_turbocina_usa_gal.toString(),
      turbocina_mex_lt_hora: params.turbocina_mex_lt_hora.toString(),
      turbocina_usa_gal_hora: params.turbocina_usa_gal_hora.toString(),
      programa_motor_anual: params.programa_motor_anual.toString(),
      montores_cantidad: params.montores_cantidad.toString(),
      costo_mtto_programado_total_anual: params.costo_mtto_programado_total_anual.toString(),
      reserva_mtto_programado_anual: params.reserva_mtto_programado_anual.toString(),
      reserva_capacitacion_pilotos_anual: params.reserva_capacitacion_pilotos_anual.toString(),
      administracion_anual: params.administracion_anual.toString(),
      sueldo_piloto_pic_anual: params.sueldo_piloto_pic_anual.toString(),
      sueldo_piloto_sic_anual: params.sueldo_piloto_sic_anual.toString(),
      guardia_hangar_anual: params.guardia_hangar_anual.toString(),
      seguro_aeronave_anual: params.seguro_aeronave_anual.toString(),
      arrendamiento_anual: params.arrendamiento_anual.toString(),
      precio_venta_aeronave: params.precio_venta_aeronave.toString(),
      precio_hr_renta: params.precio_hr_renta.toString()
    })

    /**
     * Calcula el costo total anual de operación
     * Multiplica el costo por hora por las horas totales de vuelo
     * @returns {number} Costo total anual
     */
    const calc_total_costo_anual = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return calc_total_costo_por_hora.value * totalHrs
    })

    /**
     * Calcula el costo del programa de motores por hora de vuelo
     * @returns {number} Costo del programa de motores por hora
     */
    const calc_programa_motor_anual = computed(() => {
      const programa_motor_anual = parseFloat(formData.programa_motor_anual.toString())
      const montores_cantidad = parseFloat(formData.montores_cantidad.toString())
      const costo_programa_motor_anual = programa_motor_anual * montores_cantidad
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual

      if (hrs_vuelo_total_anual === 0) return 0
      return costo_programa_motor_anual / hrs_vuelo_total_anual
    })

    /**
     * Calcula el costo total por hora de vuelo
     * Suma todos los costos individuales por hora: arrendamiento, administrativo,
     * guardia hangar, mantenimiento, seguro, combustible y programa de motores
     * @returns {number} Costo total por hora de vuelo
     */
    const calc_total_costo_por_hora = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      
      if (totalHrs === 0) return 0
      
      // Individual costs per hour
      const costoArrendamientoHr = formData.arrendamiento_anual / totalHrs
      const costoAdministrativoHr = calc_costo_administrativo_hr.value
      const costoGuardiaHangarHr = calc_costo_guardia_hangar_hr.value
      const costoMantenimientoHr = calc_reserva_mtto_total_anual.value / totalHrs
      const costoSeguroHr = formData.seguro_aeronave_anual / totalHrs
      const costoCombustibleNacionalHr = calc_fuel_mxn_costo_hr.value
      const costoCombustibleExtranjeroHr = calc_fuel_usd_costo_hr.value
      const costoProgramaMotorHr = calc_programa_motor_anual.value
      
      // Sum all costs per hour
      return costoArrendamientoHr + costoAdministrativoHr + costoGuardiaHangarHr + 
             costoMantenimientoHr + costoSeguroHr + costoCombustibleNacionalHr + 
             costoCombustibleExtranjeroHr + costoProgramaMotorHr
    })

    /**
     * Calcula el costo de combustible nacional por hora
     * Considera el consumo por hora, precio por litro y tipo de cambio USD/MXN
     * @returns {number} Costo de combustible nacional por hora en USD
     */
    const calc_fuel_mxn_costo_hr = computed(() => {
      const turbocina_mex_lt_hora = parseFloat(formData.turbocina_mex_lt_hora.toString())
      const costo_turbocina_mex_lt = parseFloat(formData.costo_turbocina_mex_lt.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual
      const costo = (turbocina_mex_lt_hora * hrs_vuelo_nacionales_anual) * costo_turbocina_mex_lt
      const costoAnual = costo / formData.tasa_cambio_usd_mxn
      
      if (hrs_vuelo_nacionales_anual === 0) return 0
      return costoAnual / hrs_vuelo_total_anual
    })

    /**
     * Calcula el costo de combustible internacional por hora
     * Considera el consumo por hora y precio por galón en USD
     * @returns {number} Costo de combustible internacional por hora en USD
     */
    const calc_fuel_usd_costo_hr = computed(() => {
      const turbocina_usa_gal_hora = parseFloat(formData.turbocina_usa_gal_hora.toString())
      const costo_turbocina_usa_gal = parseFloat(formData.costo_turbocina_usa_gal.toString())
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual
      const costoAnual = (turbocina_usa_gal_hora * hrs_vuelo_extranjero_anual) * costo_turbocina_usa_gal

      if (hrs_vuelo_extranjero_anual === 0) return 0
      return costoAnual / hrs_vuelo_total_anual
    })

    /**
     * Valor formateado del costo de mantenimiento con inflación
     * @returns {string} Costo formateado como moneda
     */
    const formattedCostoMttoInflacion = computed(() => {
      return formatCurrency(costo_mtto_programado_total_anual_inflacion.value)
    })

    /**
     * Calcula el costo total anual con inflación año por año
     * Aplica la tasa de inflación anual al costo total de operación
     * @returns {Array} Array de objetos con costo por año e incrementos por inflación
     */
    const totalCostoAnualConInflacionPorAnio = computed(() => {
      const years = formData.anos_inversion
      const baseAnnualCost = calc_total_costo_anual.value
      const inflationRate = formData.tasa_inflacion_anual / 100
      const yearlyCosts = []

      for (let year = 1; year <= years; year++) {
        let costWithInflation: number
        
        if (year === 1) {
          // First year: no inflation
          costWithInflation = baseAnnualCost
        } else {
          // Subsequent years: apply inflation
          costWithInflation = baseAnnualCost * Math.pow(1 + inflationRate, year - 1)
        }

        yearlyCosts.push({
          anio: year,
          costo: costWithInflation,
          costoFormateado: formatCurrencyText(costWithInflation),
          incremento: year === 1 ? 0 : costWithInflation - baseAnnualCost,
          incrementoFormateado: year === 1 ? '$0.00' : formatCurrencyText(costWithInflation - baseAnnualCost)
        })
      }

      return yearlyCosts
    })

    /**
     * Obtiene el valor máximo de horas de vuelo permitidas según mtto_params
     * @returns {number} Valor máximo de horas
     */
    const getMaxHoras = () => {
      return Math.max(...horasOpciones)
    }

    /**
     * Actualiza un parámetro numérico en el formulario
     * @param {string} key - Clave del parámetro a actualizar
     * @param {number} value - Nuevo valor numérico
     */
    const updateParam = (key: keyof typeof formData, value: number) => {
      // Validación especial para horas_renta_sae
      if (key === 'horas_renta_sae') {
        const maxHoras = getMaxHoras()
        const horasTotales = horasConfig.horas_totales
        const maxHorasRentaSae = maxHoras - horasTotales
        
        if (maxHorasRentaSae <= 0) {
          validationMessage.value = `No se pueden asignar horas de renta SAE. Las horas totales anuales (${horasTotales}) ya alcanzan o superan el máximo permitido de ${maxHoras} horas.`
          formData[key] = 0
          setTimeout(() => {
            validationMessage.value = ''
          }, 15000)
          return
        }
        
        // Validar que sea múltiplo de 100
        if (value > 0 && value % 100 !== 0) {
          const adjustedValue = Math.floor(value / 100) * 100
          validationMessage.value = `Las Horas Renta SAE deben ser múltiplo de 100. El valor se ha ajustado de ${value} a ${adjustedValue}.`
          value = adjustedValue
          setTimeout(() => {
            validationMessage.value = ''
          }, 15000)
        }
        
        if (value > maxHorasRentaSae) {
          // Ajustar al múltiplo de 100 más cercano que no supere el máximo
          const adjustedMax = Math.floor(maxHorasRentaSae / 100) * 100
          validationMessage.value = `El valor máximo para Horas Renta SAE es ${adjustedMax} (múltiplo de 100 más cercano al límite de ${maxHorasRentaSae}). La suma de Horas Totales Anuales (${horasTotales}) + Horas Renta SAE no puede superar ${maxHoras} horas.`
          formData[key] = adjustedMax
          setTimeout(() => {
            validationMessage.value = ''
          }, 15000)
          return
        }
        
        // Limpiar mensaje si el valor es válido
        validationMessage.value = ''
      }
      
      formData[key] = value
    }

    /**
     * Actualiza un campo de moneda en el formulario
     * Convierte el string de entrada a número y actualiza tanto formData como formattedData
     * @param {string} key - Clave del campo a actualizar
     * @param {string} value - Nuevo valor como string
     */
    const updateCurrencyField = (key: keyof typeof formattedData, value: string) => {
      const numericValue = parseCurrency(value)
      const formattedValue = formatCurrency(numericValue)
      
      // Update the formatted display value
      formattedData[key] = formattedValue
      
      // Update the actual numeric value in formData
      const formDataKey = key as keyof typeof formData
      if (formDataKey in formData) {
        (formData as any)[formDataKey] = numericValue
      }
    }

    /**
     * Restaura todos los valores del formulario a los valores por defecto
     * Resetea tanto formData como formattedData a los valores originales de params.json
     */
    const resetToDefaults = () => {
      Object.keys(formData).forEach(key => {
        const paramKey = key as keyof typeof params
        if (params[paramKey] !== undefined && typeof params[paramKey] === 'number') {
          (formData as any)[key] = params[paramKey]
        }
      })

      // Reset campos específicos que ahora están en params.json
      formData.horas_renta_sae = params.horas_renta_sae
      formData.precio_hr_renta = params.precio_hr_renta

      // Reset formatted data
      Object.keys(formattedData).forEach(key => {
        const paramKey = key as keyof typeof params
        if (params[paramKey] !== undefined && typeof params[paramKey] === 'number') {
          (formattedData as any)[key] = formatCurrency(params[paramKey])
        }
      })

      // Reset formatted data específicos que ahora están en params.json
      formattedData.precio_hr_renta = params.precio_hr_renta.toString()
    }

    /**
     * Maneja el envío del formulario
     * Actualmente solo registra los datos en consola
     */
    const handleSubmit = () => {
      console.log('Form submitted with data:', formData)
    }

    /**
     * Alterna la visibilidad del panel de configuración avanzada
     */
    const toggleConfiguration = () => {
      showConfiguration.value = !showConfiguration.value
    }

    /**
     * Calcula la inversión inicial requerida
     * Suma el precio de la aeronave más el costo anual de operación
     * @returns {number} Inversión inicial total
     */
    const calc_inversion_inicial = computed(() => {
      const costo_anual = calc_total_costo_anual.value
      return formData.precio_venta_aeronave + costo_anual
    })

    /**
     * Calcula la inversión total considerando inflación
     * Suma el precio de la aeronave más todos los costos anuales con inflación
     * @returns {number} Inversión total con inflación
     */
    const calc_inversion_total = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      return formData.precio_venta_aeronave + costo_total
    })

    /**
     * Calcula el valor residual de un activo utilizando el método de depreciación de saldo decreciente
     * @param {number} purchasePrice - El precio de compra original del activo
     * @param {number} depreciationRate - La tasa de depreciación anual en porcentaje (ej. 8 para 8%)
     * @param {number} ownershipYears - El número de años de posesión
     * @returns {number} El valor residual estimado del activo
     */
    function calculateResaleValue(purchasePrice: number, depreciationRate: number, ownershipYears: number) {
      const rateDecimal = depreciationRate / 100;
      const valorDepreciableAnual = purchasePrice * rateDecimal
      const valorDepreciableTotal = valorDepreciableAnual * ownershipYears
      const resaleValue = purchasePrice - valorDepreciableTotal

      return resaleValue;
    }

    /**
     * Calcula el valor de reventa de la aeronave al final del período de inversión
     * Aplica la depreciación anual al precio de compra
     * @returns {number} Valor de reventa estimado
     */
    const calc_resale_value = computed(() => {
      const purchasePrice = formData.precio_venta_aeronave
      const depreciationRate = formData.tasa_depreciacion_anual
      const ownershipYears = formData.anos_inversion
      const resaleValue = calculateResaleValue(purchasePrice, depreciationRate, ownershipYears)

      return resaleValue
    })

    /**
     * Calcula los ingresos totales por arrendamiento durante el período de inversión
     * @returns {number} Ingresos totales por arrendamiento
     */
    const calc_ingresos_renta_anual = computed(() => {  
      const arrendamiento_anual = formData.arrendamiento_anual || 0
      return arrendamiento_anual * formData.anos_inversion
    })

    /**
     * Calcula los ingresos totales por renta SAE durante el período de inversión
     * @returns {number} Ingresos totales por renta SAE
     */
    const calc_ingresos_renta_sae = computed(() => {
      const precio_hr = parseCurrency(formattedData.precio_hr_renta)
      const horas_anuales = formData.horas_renta_sae || 0
      const anos = formData.anos_inversion || 0
      return precio_hr * horas_anuales * anos
    })

    /**
     * Calcula la inversión final neta
     * Considera: inversión total - ingresos por arrendamiento - ingresos por renta SAE - valor de reventa
     * @returns {number} Inversión final neta
     */
    const calc_inversion_final = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      const calc_inversion_total = formData.precio_venta_aeronave + costo_total

      const arrendamiento_anual = formData.arrendamiento_anual || 0
      const calc_ingresos_renta_anual = arrendamiento_anual * formData.anos_inversion

      const purchasePrice = formData.precio_venta_aeronave
      const depreciationRate = formData.tasa_depreciacion_anual
      const ownershipYears = formData.anos_inversion
      const resaleValue = calculateResaleValue(purchasePrice, depreciationRate, ownershipYears)

      const final = calc_inversion_total - calc_ingresos_renta_anual - calc_ingresos_renta_sae.value - resaleValue
      return final
    })

    /**
     * Calcula la inversión final neta (Contemplando beneficio fiscal)
     * Considera: inversión total - ingresos por arrendamiento - ingresos por renta SAE - valor de reventa
     * @returns {number} Inversión final neta
     */
    const calc_inversion_final_beneficio_fiscal = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      const calc_inversion_total = formData.precio_venta_aeronave + costo_total

      const arrendamiento_anual = formData.arrendamiento_anual || 0
      const calc_ingresos_renta_anual = arrendamiento_anual * formData.anos_inversion

      const purchasePrice = formData.precio_venta_aeronave
      const depreciationRate = formData.tasa_depreciacion_anual
      const ownershipYears = formData.anos_inversion
      const resaleValue = calculateResaleValue(purchasePrice, depreciationRate, ownershipYears)

      const final = calc_inversion_total - calc_ingresos_renta_anual - calc_ingresos_renta_sae.value - resaleValue - calc_beneficio_fiscal.value
      return final
    })

    /**
     * Calcula el costo de arrendamiento por hora de vuelo
     * @returns {number} Costo de arrendamiento por hora
     */
    const calc_costo_arrendamiento_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return formData.arrendamiento_anual / totalHrs
    })

    /**
     * Calcula el costo de guardia de hangar por hora de vuelo
     * @returns {number} Costo de guardia de hangar por hora
     */
    const calc_costo_guardia_hangar_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      const guardiaHangar = costosOpcionales.incluir_guardia_hangar ? formData.guardia_hangar_anual : 0
      return guardiaHangar / totalHrs
    })

    /**
     * Calcula el costo de mantenimiento por hora de vuelo
     * @returns {number} Costo de mantenimiento por hora
     */
    const calc_costo_mantenimiento_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return calc_reserva_mtto_total_anual.value / totalHrs
    })

    /**
     * Calcula el costo de seguro por hora de vuelo
     * @returns {number} Costo de seguro por hora
     */
    const calc_costo_seguro_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return formData.seguro_aeronave_anual / totalHrs
    })

    /**
     * Calcula la diferencia entre el paquete de horas y la inversión final
     * Indica si la operación es rentable (valor positivo) o no (valor negativo)
     * @returns {number} Diferencia entre ingresos y costos
     */
    const calc_diferencia_paquete_hrs_inversion = computed(() => {
      return paqueteHrsVueloTotal.value - calc_inversion_final.value
    })

    /**
     * Calcula la diferencia entre el paquete de horas y la inversión final
     * Indica si la operación es rentable (valor positivo) o no (valor negativo)
     * Contempla el beneficio fiscal
     * @returns {number} Diferencia entre ingresos y costos
     */
    const calc_diferencia_paquete_hrs_inversion_beneficio_fiscal = computed(() => {
      return paqueteHrsVueloTotal.value - (calc_inversion_final.value - calc_beneficio_fiscal.value)
    })

    /**
     * Calcula el beneficio fiscal estimado
     * Considera 30% de beneficio fiscal sobre la aeronave y costos totales
     * @returns {number} Beneficio fiscal total
     */
    const calc_beneficio_fiscal = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      const beneficio_aeronave = formData.precio_venta_aeronave * 0.3
      const beneficio_costo = costo_total * 0.3
      const beneficio_total = beneficio_aeronave + beneficio_costo
      return beneficio_total
    })

    return {
      formData,
      formattedData,
      horasConfig,
      horasOpciones,
      calc_costo_mtto_programado,
      showConfiguration,
      costosOpcionales,
      validationMessage,
      toggleConfiguration,
      formattedCostoMttoInflacion,
      updateParam,
      updateCurrencyField,
      resetToDefaults,
      handleSubmit,
      formatCurrencyText,
      calc_reserva_mtto_discrepancias_anual,
      calc_reserva_mtto_interiores_anual,
      calc_reserva_mtto_total_anual,
      calc_costo_administrativo_hr,
      calc_fuel_mxn_costo_hr,
      calc_fuel_usd_costo_hr,
      calc_programa_motor_anual,
      calc_total_costo_por_hora,
      calc_total_costo_anual,
      totalCostoAnualConInflacionPorAnio,
      calc_inversion_inicial,
      calc_resale_value,
      calc_inversion_total,
      calc_ingresos_renta_anual,
      calc_ingresos_renta_sae,
      calc_inversion_final,
      calc_costo_arrendamiento_hr,
      calc_costo_guardia_hangar_hr,
      calc_costo_mantenimiento_hr,
      calc_costo_seguro_hr,
      paqueteHrsVuelo,
      paqueteHrsVueloTotal,
      calc_diferencia_paquete_hrs_inversion,
      calc_beneficio_fiscal,
      actualizarPorcentaje,
      actualizarHorasTotales,
      calc_diferencia_paquete_hrs_inversion_beneficio_fiscal,
      calc_inversion_final_beneficio_fiscal
    }
  },
})
