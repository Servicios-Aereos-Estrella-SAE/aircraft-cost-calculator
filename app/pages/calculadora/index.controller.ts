import { defineComponent, reactive, computed, watch, ref, onMounted } from 'vue'
import jsonParams from './src/params.json'

export default defineComponent({
  name: 'calculadora',
  setup() {
    
    const params = jsonParams
    const factorS600HrsMttoDiscrepancias = 80000 / 600
    const factorS600HrsMttoInteriores = 20000 / 600

    // Campos adicionales para cálculo de horas por porcentaje
    const horasConfig = reactive({
      horas_totales: params.hrs_vuelo_nacionales_anual + params.hrs_vuelo_extranjero_anual,
      porcentaje_hrs_nacionales: 60, // Porcentaje por defecto
      porcentaje_hrs_extranjero: 40  // Porcentaje por defecto
    })

    // Reactive form data
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
      
      // Costos de turbosina
      costo_turbocina_mex_lt: params.costo_turbocina_mex_lt,
      costo_turbocina_usa_gal: params.costo_turbocina_usa_gal,
      turbocina_mex_lt_hora: params.turbocina_mex_lt_hora,
      turbocina_usa_gal_hora: params.turbocina_usa_gal_hora,
      
      // Programa de motores
      programa_motor_anual: params.programa_motor_anual,
      montores_cantidad: params.montores_cantidad,
      
      // Mantenimiento
      costo_mtto_programado_total_anual: params.costo_mtto_programado_total_anual,
      
      // Reservas de mantenimiento
      reserva_mtto_programado_anual: params.reserva_mtto_programado_anual,
      reserva_mtto_discrepancias_anual: params.reserva_mtto_discrepancias_anual,
      reserva_mtto_interiores_anual: params.reserva_mtto_interiores_anual,
      reserva_mtto_total_anual: params.reserva_mtto_total_anual,
      reserva_mtto_total_anual_por_hora: params.reserva_mtto_total_anual_por_hora,
      
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

    // Función para calcular horas basándose en porcentajes
    const calcularHorasPorPorcentaje = () => {
      const horasTotales = horasConfig.horas_totales || 0
      formData.hrs_vuelo_nacionales_anual = Math.round((horasTotales * horasConfig.porcentaje_hrs_nacionales) / 100)
      formData.hrs_vuelo_extranjero_anual = Math.round((horasTotales * horasConfig.porcentaje_hrs_extranjero) / 100)
    }

    // Función para actualizar porcentajes y asegurar que sumen 100%
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

    // Watchers para calcular automáticamente las horas basándose en porcentajes
    watch([() => horasConfig.horas_totales, () => horasConfig.porcentaje_hrs_nacionales, () => horasConfig.porcentaje_hrs_extranjero], () => {
      calcularHorasPorPorcentaje()
    }, { immediate: true })

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

    const paqueteHrsVueloTotal = computed(() => {
      return paqueteHrsVuelo.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
    })

    const calc_costo_administrativo_hr = computed(() => {
      const costoAdministrativo = formData.administracion_anual + formData.reserva_capacitacion_pilotos_anual + formData.sueldo_piloto_pic_anual + formData.sueldo_piloto_sic_anual
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return (costoAdministrativo * formData.anos_inversion) / (totalHrs * formData.anos_inversion)
    })

    const calc_reserva_mtto_discrepancias_anual = computed(() => {
      return factorS600HrsMttoDiscrepancias * (parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString()))
    })

    const calc_reserva_mtto_interiores_anual = computed(() => {
      return factorS600HrsMttoInteriores * (parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString()))
    })

    const calc_reserva_mtto_total_anual = computed(() => {
      return formData.reserva_mtto_programado_anual + calc_reserva_mtto_discrepancias_anual.value + calc_reserva_mtto_interiores_anual.value
    })

    // Computed property for maintenance cost with inflation year by year
    const costo_mtto_programado_total_anual_inflacion = computed(() => {
      if (!costoMttoInflacionPorAnio?.value) {
        return 0
      }

      const costoConInflacionCalculado = costoMttoInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)

      formData.reserva_mtto_programado_anual = costoConInflacionCalculado / formData.anos_inversion
      formattedData.reserva_mtto_programado_anual = formatCurrency(formData.reserva_mtto_programado_anual)
      
      return costoConInflacionCalculado
    })

    const costoMttoProgranoAnualHr = computed(() => {
      const costoConInflacionCalculado = costo_mtto_programado_total_anual_inflacion.value
      const horasVueloAnual = formData.hrs_vuelo_nacionales_anual + formData.hrs_vuelo_extranjero_anual
      return costoConInflacionCalculado / (horasVueloAnual * formData.anos_inversion)
    })

    // Computed property for maintenance cost inflation by year (based on investment years)
    const costoMttoInflacionPorAnio = computed(() => {
      const years = formData.anos_inversion
      const baseCost = formData.costo_mtto_programado_total_anual / years
      const inflationUSARate = formData.tasa_inflacion_usa / 100
      const yearlyCosts = []

      console.log('🚀 ---------------------------------------------------🚀')
      console.log('🚀 ~ costoMttoInflacionPorAnio ~ baseCost:', baseCost)
      console.log('🚀 ---------------------------------------------------🚀')

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

      console.log('🚀 -----------------------------------------------------------------🚀')
      console.log('🚀 ~ constcostoMttoInflacionPorAnio=computed ~ yearlyCosts:', yearlyCosts)
      console.log('🚀 -----------------------------------------------------------------🚀')

      return yearlyCosts
    })

    // Currency formatting functions
    const formatCurrency = (value: number): string => {
      if (isNaN(value) || value === null || value === undefined) return '0'
      return value.toString()
      // return new Intl.NumberFormat('en-US', {
      //   minimumFractionDigits: 2,
      //   maximumFractionDigits: 2
      // }).format(value)
    }

    // Currency formatting functions
    const formatCurrencyText = (value: number | string): string => {
      if (isNaN(Number(value)) || value === null || value === undefined) return '0.00'
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(value))
    }

    const parseCurrency = (value: string): number => {
      // if (!value) return 0
      // // Remove all non-numeric characters except decimal point
      // const cleanValue = value.replace(/[^\d.]/g, '')
      // const number = parseFloat(cleanValue)
      const number = parseFloat(value)
      return isNaN(number) ? 0 : number
    }

    // Reactive formatted data for display
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
      reserva_mtto_discrepancias_anual: params.reserva_mtto_discrepancias_anual.toString(),
      reserva_mtto_interiores_anual: params.reserva_mtto_interiores_anual.toString(),
      reserva_mtto_total_anual: params.reserva_mtto_total_anual.toString(),
      reserva_mtto_total_anual_por_hora: params.reserva_mtto_total_anual_por_hora.toString(),
      reserva_capacitacion_pilotos_anual: params.reserva_capacitacion_pilotos_anual.toString(),
      administracion_anual: params.administracion_anual.toString(),
      sueldo_piloto_pic_anual: params.sueldo_piloto_pic_anual.toString(),
      sueldo_piloto_sic_anual: params.sueldo_piloto_sic_anual.toString(),
      guardia_hangar_anual: params.guardia_hangar_anual.toString(),
      seguro_aeronave_anual: params.seguro_aeronave_anual.toString(),
      arrendamiento_anual: params.arrendamiento_anual.toString(),
      precio_venta_aeronave: params.precio_venta_aeronave.toString()
    })

    const calc_total_costo_anual = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return calc_total_costo_por_hora.value * totalHrs
    })

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

    // Computed property for total cost per hour (sum of all costs)
    const calc_total_costo_por_hora = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      
      if (totalHrs === 0) return 0
      
      // Individual costs per hour
      const costoArrendamientoHr = formData.arrendamiento_anual / totalHrs
      const costoAdministrativoHr = calc_costo_administrativo_hr.value
      const costoGuardiaHangarHr = formData.guardia_hangar_anual / totalHrs
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

    const calc_fuel_mxn_costo_anual = computed(() => {
      const turbocina_mex_lt_hora = parseFloat(formData.turbocina_mex_lt_hora.toString())
      const costo_turbocina_mex_lt = parseFloat(formData.costo_turbocina_mex_lt.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual
      const costo = (turbocina_mex_lt_hora * hrs_vuelo_nacionales_anual) * costo_turbocina_mex_lt
      // const costo = (turbocina_mex_lt_hora * hrs_vuelo_total_anual) * costo_turbocina_mex_lt
      const costoAnual = costo / formData.tasa_cambio_usd_mxn
      return costoAnual
    })

    const calc_fuel_usd_costo_anual = computed(() => {
      const turbocina_usa_gal_hora = parseFloat(formData.turbocina_usa_gal_hora.toString())
      const costo_turbocina_usa_gal = parseFloat(formData.costo_turbocina_usa_gal.toString())
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual
      // return (turbocina_usa_gal_hora * hrs_vuelo_total_anual) * costo_turbocina_usa_gal
      const costoAnual = (turbocina_usa_gal_hora * hrs_vuelo_extranjero_anual) * costo_turbocina_usa_gal
      return costoAnual
    })

    const calc_fuel_mxn_costo_hr = computed(() => {
      const fuel_mxn_costo_anual = calc_fuel_mxn_costo_anual.value
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual
      
      if (hrs_vuelo_nacionales_anual === 0) return 0

      const costoHr = fuel_mxn_costo_anual / hrs_vuelo_total_anual
      return costoHr
    })

    const calc_fuel_usd_costo_hr = computed(() => {
      const fuel_usd_costo_anual = calc_fuel_usd_costo_anual.value
      const hrs_vuelo_extranjero_anual = parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      const hrs_vuelo_nacionales_anual = parseFloat(formData.hrs_vuelo_nacionales_anual.toString())
      const hrs_vuelo_total_anual = hrs_vuelo_nacionales_anual + hrs_vuelo_extranjero_anual

      if (hrs_vuelo_extranjero_anual === 0) return 0

      const costoHr = fuel_usd_costo_anual / hrs_vuelo_total_anual
      return costoHr
    })

    // Computed formatted value for maintenance cost with inflation
    const formattedCostoMttoInflacion = computed(() => {
      return formatCurrency(costo_mtto_programado_total_anual_inflacion.value)
    })

    // Computed property for total annual cost with inflation by year
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

    // Methods
    const updateParam = (key: keyof typeof formData, value: number) => {
      formData[key] = value
    }

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

    const resetToDefaults = () => {
      Object.keys(formData).forEach(key => {
        const paramKey = key as keyof typeof params
        if (params[paramKey] !== undefined && typeof params[paramKey] === 'number') {
          (formData as any)[key] = params[paramKey]
        }
      })

      // Reset formatted data
      Object.keys(formattedData).forEach(key => {
        const paramKey = key as keyof typeof params
        if (params[paramKey] !== undefined && typeof params[paramKey] === 'number') {
          (formattedData as any)[key] = formatCurrency(params[paramKey])
        }
      })
    }

    const handleSubmit = () => {
      console.log('Form submitted with data:', formData)
      // Aquí puedes agregar la lógica de cálculo
    }

    onMounted(() => {
      console.log('Form data initialized:', formData)
    })

    const calc_inversion_inicial = computed(() => {
      const costo_anual = calc_total_costo_anual.value
      return formData.precio_venta_aeronave + costo_anual
    })

    const calc_inversion_total = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      return formData.precio_venta_aeronave + costo_total
    })

    /**
     * Calcula el valor residual de un activo utilizando el método de depreciación de saldo decreciente.
     * @param {number} purchasePrice El precio de compra original del activo.
     * @param {number} depreciationRate La tasa de depreciación anual en porcentaje (ej. 8 para 8%).
     * @param {number} ownershipYears El número de años de posesión.
     * @returns {number} El valor residual estimado del activo.
     */
    function calculateResaleValue(purchasePrice: number, depreciationRate: number, ownershipYears: number) {
      const rateDecimal = depreciationRate / 100;
      const valorDepreciableAnual = purchasePrice * rateDecimal
      const valorDepreciableTotal = valorDepreciableAnual * ownershipYears
      const resaleValue = purchasePrice - valorDepreciableTotal

      return resaleValue;
    }

    const calc_resale_value = computed(() => {
      const purchasePrice = formData.precio_venta_aeronave
      const depreciationRate = formData.tasa_depreciacion_anual
      const ownershipYears = formData.anos_inversion
      const resaleValue = calculateResaleValue(purchasePrice, depreciationRate, ownershipYears)

      return resaleValue
    })

    const calc_ingresos_renta_anual = computed(() => {  
      const arrendamiento_anual = formData.arrendamiento_anual || 0
      return arrendamiento_anual * formData.anos_inversion
    })

    const calc_inversion_final = computed(() => {
      const costo_total = totalCostoAnualConInflacionPorAnio.value.reduce((acc: number, curr: any) => acc + curr.costo, 0)
      const calc_inversion_total = formData.precio_venta_aeronave + costo_total

      const arrendamiento_anual = formData.arrendamiento_anual || 0
      const calc_ingresos_renta_anual = arrendamiento_anual * formData.anos_inversion

      const purchasePrice = formData.precio_venta_aeronave
      const depreciationRate = formData.tasa_depreciacion_anual
      const ownershipYears = formData.anos_inversion
      const resaleValue = calculateResaleValue(purchasePrice, depreciationRate, ownershipYears)

      const final = calc_inversion_total - calc_ingresos_renta_anual - resaleValue
      return final
    })

    // Computed properties for inline calculations to avoid division by zero
    const calc_costo_arrendamiento_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return formData.arrendamiento_anual / totalHrs
    })

    const calc_costo_guardia_hangar_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return formData.guardia_hangar_anual / totalHrs
    })

    const calc_costo_mantenimiento_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return calc_reserva_mtto_total_anual.value / totalHrs
    })

    const calc_costo_seguro_hr = computed(() => {
      const totalHrs = parseFloat(formData.hrs_vuelo_nacionales_anual.toString()) + parseFloat(formData.hrs_vuelo_extranjero_anual.toString())
      if (totalHrs === 0) return 0
      return formData.seguro_aeronave_anual / totalHrs
    })

    const calc_diferencia_paquete_hrs_inversion = computed(() => {
      return paqueteHrsVueloTotal.value - calc_inversion_final.value
    })

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
      costo_mtto_programado_total_anual_inflacion,
      formattedCostoMttoInflacion,
      costoMttoInflacionPorAnio,
      costoMttoProgranoAnualHr,
      updateParam,
      updateCurrencyField,
      resetToDefaults,
      handleSubmit,
      formatCurrency,
      formatCurrencyText,
      calc_reserva_mtto_discrepancias_anual,
      calc_reserva_mtto_interiores_anual,
      calc_reserva_mtto_total_anual,
      calc_costo_administrativo_hr,
      calc_fuel_mxn_costo_anual,
      calc_fuel_usd_costo_anual,
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
      calcularHorasPorPorcentaje
    }
  },
})
