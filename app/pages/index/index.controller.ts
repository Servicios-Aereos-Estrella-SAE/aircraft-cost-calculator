import { defineComponent, reactive, computed, watch, ref } from 'vue'

export default defineComponent({
  name: 'index-calculator',
  setup() {
    // Estado para animaciones
    const isUpdating = ref(false)
    const isGeneratingImage = ref(false)
    
    // Parámetros Básicos
    const basicParams = reactive({
      purchasePrice: 2500000,
      depreciationRate: 8, // Factor de pérdida de valor anual (%)
      nationalHoursPerYear: 200,
      internationalHoursPerYear: 100,
      ownershipYears: 5,
      viaticsPercentage: 6
    })

    // Costos Fijos
    const fixedCosts = reactive({
      hangarGuard: 6500,
      administration: 8500,
      insurance: 29881,
      pilotTrainingReserve: 81120,
      maintenanceReserve: 83681,
      pilotSalary: 7517.5,
      copilotSalary: 7517.5,
      leasing: 19600
    })

    // Costos Variables por Hora
    const variableCosts = reactive({
      turbineMexicoPrice: 832,
      turbineForeignPrice: 950,
      engineProgram: 738.20,
      maintenanceReservePerHour: 167
    })

    // Utility functions for currency formatting
    const formatCurrencyForInput = (value: number): string => {
      if (!value && value !== 0) return ''
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }

    const parseCurrencyFromInput = (value: string): number => {
      if (!value) return 0
      // Remove all non-numeric characters except decimal point
      const cleanValue = value.replace(/[^\d.]/g, '')
      const numValue = parseFloat(cleanValue)
      return isNaN(numValue) ? 0 : numValue
    }

    const formatCurrencyForDisplay = (value: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value).replace('$', '')
    }

    // Currency input handlers
    const handleCurrencyInput = (event: Event, target: any, property: string) => {
      const input = event.target as HTMLInputElement
      const cursorPosition = input.selectionStart || 0
      const oldValue = input.value
      
      // Parse the current value
      const numericValue = parseCurrencyFromInput(input.value)
      
      // Update the reactive property
      target[property] = numericValue
      
      // Format for display
      const formattedValue = formatCurrencyForInput(numericValue)
      
      // Update input value
      input.value = formattedValue
      
      // Restore cursor position
      const newCursorPosition = Math.min(cursorPosition, formattedValue.length)
      input.setSelectionRange(newCursorPosition, newCursorPosition)
    }

    // Cálculos computados
    const calculations = computed(() => {
      const totalHoursPerYear = basicParams.nationalHoursPerYear + basicParams.internationalHoursPerYear
      
      // Costos fijos anuales
      const annualFixedCosts = {
        hangarGuard: fixedCosts.hangarGuard * 12,
        administration: fixedCosts.administration * 12,
        insurance: fixedCosts.insurance,
        pilotTrainingReserve: fixedCosts.pilotTrainingReserve,
        maintenanceReserve: fixedCosts.maintenanceReserve,
        pilotSalary: fixedCosts.pilotSalary * 12,
        copilotSalary: fixedCosts.copilotSalary * 12,
        leasing: fixedCosts.leasing * 12
      }
      
      const totalAnnualFixedCosts = Object.values(annualFixedCosts).reduce((sum, cost) => sum + cost, 0)
      
      // Cálculo del costo promedio ponderado de turbosina
      const weightedFuelCost = (
        (variableCosts.turbineMexicoPrice * basicParams.nationalHoursPerYear) +
        (variableCosts.turbineForeignPrice * basicParams.internationalHoursPerYear)
      ) / totalHoursPerYear
      
      // Costos variables por hora
      const totalVariableCostPerHour = weightedFuelCost + variableCosts.engineProgram + variableCosts.maintenanceReservePerHour
      
      // Total por hora incluyendo costos fijos
      const fixedCostPerHour = totalAnnualFixedCosts / totalHoursPerYear
      const totalCostPerHour = fixedCostPerHour + totalVariableCostPerHour
      
      // Aplicar margen de viáticos
      const totalWithViotics = totalCostPerHour * (1 + basicParams.viaticsPercentage / 100)
      
      // NUEVOS CÁLCULOS PARA LOS INDICADORES
      
      // Cálculo del valor de reventa basado en la tasa de depreciación anual
      const depreciationRate = basicParams.depreciationRate || 8 // Valor por defecto si es undefined
      const ownershipYears = basicParams.ownershipYears || 5 // Valor por defecto si es undefined
      const purchasePrice = basicParams.purchasePrice || 0 // Valor por defecto si es undefined
      
      const resaleValue = purchasePrice * Math.pow(1 - depreciationRate / 100, ownershipYears)
      
      // Costo neto de aeronave (compra - reventa)
      const netAircraftCost = basicParams.purchasePrice - resaleValue
      
      // Costos totales durante el período de propiedad
      const totalFixedCostsOverPeriod = totalAnnualFixedCosts * basicParams.ownershipYears
      const totalHoursOverPeriod = totalHoursPerYear * basicParams.ownershipYears
      const totalVariableCostsOverPeriod = totalVariableCostPerHour * totalHoursOverPeriod
      
      // Total general (fijos + variables + costo neto aeronave)
      const grandTotal = totalFixedCostsOverPeriod + totalVariableCostsOverPeriod + netAircraftCost
      
      // Porcentajes
      const fixedCostPercentage = (totalFixedCostsOverPeriod / grandTotal) * 100
      const variableCostPercentage = (totalVariableCostsOverPeriod / grandTotal) * 100
      const netAircraftCostPercentage = (netAircraftCost / grandTotal) * 100
      
      return {
        totalHoursPerYear,
        totalAnnualFixedCosts,
        weightedFuelCost: Math.round(weightedFuelCost),
        totalVariableCostPerHour: Math.round(totalVariableCostPerHour),
        fixedCostPerHour: Math.round(fixedCostPerHour),
        totalCostPerHour: Math.round(totalCostPerHour),
        totalWithViotics: Math.round(totalWithViotics),
        annualFixedCosts,
        // Nuevos cálculos
        resaleValue: Math.round(resaleValue),
        netAircraftCost,
        totalFixedCostsOverPeriod,
        totalVariableCostsOverPeriod,
        totalHoursOverPeriod,
        grandTotal,
        fixedCostPercentage,
        variableCostPercentage,
        netAircraftCostPercentage,
        // Detalles para el desglose
        detailedFixedCosts: {
          hangarGuard: {
            monthly: fixedCosts.hangarGuard,
            annual: annualFixedCosts.hangarGuard,
            total: annualFixedCosts.hangarGuard * basicParams.ownershipYears
          },
          administration: {
            monthly: fixedCosts.administration,
            annual: annualFixedCosts.administration,
            total: annualFixedCosts.administration * basicParams.ownershipYears
          },
          insurance: {
            annual: fixedCosts.insurance,
            total: fixedCosts.insurance * basicParams.ownershipYears
          },
          pilotTrainingReserve: {
            annual: fixedCosts.pilotTrainingReserve,
            total: fixedCosts.pilotTrainingReserve * basicParams.ownershipYears
          },
          maintenanceReserve: {
            annual: fixedCosts.maintenanceReserve,
            total: fixedCosts.maintenanceReserve * basicParams.ownershipYears
          },
          pilotSalary: {
            monthly: fixedCosts.pilotSalary,
            annual: annualFixedCosts.pilotSalary,
            total: annualFixedCosts.pilotSalary * basicParams.ownershipYears
          },
          copilotSalary: {
            monthly: fixedCosts.copilotSalary,
            annual: annualFixedCosts.copilotSalary,
            total: annualFixedCosts.copilotSalary * basicParams.ownershipYears
          },
          leasing: {
            monthly: fixedCosts.leasing,
            annual: annualFixedCosts.leasing,
            total: annualFixedCosts.leasing * basicParams.ownershipYears
          }
        },
        detailedVariableCosts: {
          turbine: {
            nationalCostPerHour: variableCosts.turbineMexicoPrice,
            internationalCostPerHour: variableCosts.turbineForeignPrice,
            nationalHoursPerYear: basicParams.nationalHoursPerYear,
            internationalHoursPerYear: basicParams.internationalHoursPerYear,
            weightedAveragePerHour: Math.round(weightedFuelCost),
            totalNationalCost: variableCosts.turbineMexicoPrice * basicParams.nationalHoursPerYear * basicParams.ownershipYears,
            totalInternationalCost: variableCosts.turbineForeignPrice * basicParams.internationalHoursPerYear * basicParams.ownershipYears,
            totalCost: Math.round(weightedFuelCost) * totalHoursOverPeriod
          },
          engineProgram: {
            perHour: variableCosts.engineProgram,
            total: variableCosts.engineProgram * totalHoursOverPeriod
          },
          maintenanceReservePerHour: {
            perHour: variableCosts.maintenanceReservePerHour,
            total: variableCosts.maintenanceReservePerHour * totalHoursOverPeriod
          },
          totalVariablePerHour: Math.round(totalVariableCostPerHour)
        }
      }
    })

    // Formatear números con animación
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value).replace('$', '')
    }

    const formatNumber = (value: number) => {
      return new Intl.NumberFormat('en-US').format(value)
    }

    // Función para generar y descargar imagen
    const generateAndDownloadImage = async () => {
      try {
        isGeneratingImage.value = true
        
        // Importar html2canvas dinámicamente
        const html2canvas = (await import('html2canvas')).default
        
        // Obtener el elemento que contiene la información hasta antes de los formularios
        const targetElement = document.querySelector('.calculator-container') as HTMLElement
        if (!targetElement) {
          console.error('No se encontró el elemento objetivo')
          alert('Error al encontrar el contenido. Por favor, inténtalo de nuevo.')
          return
        }
        
        // Crear un elemento temporal para capturar solo la parte que queremos
        const tempContainer = document.createElement('div')
        tempContainer.style.position = 'absolute'
        tempContainer.style.left = '-9999px'
        tempContainer.style.top = '0'
        tempContainer.style.width = targetElement.offsetWidth + 'px'
        tempContainer.style.backgroundColor = '#ffffff'
        tempContainer.style.padding = '20px'
        tempContainer.style.boxSizing = 'border-box'
        
        // Clonar los elementos que queremos incluir
        const banner = targetElement.querySelector('.aircraft-banner')?.cloneNode(true)
        const indicators = targetElement.querySelector('.cost-indicators')?.cloneNode(true)
        const breakdown = targetElement.querySelector('.detailed-breakdown')?.cloneNode(true)
        
        if (banner) tempContainer.appendChild(banner)
        if (indicators) tempContainer.appendChild(indicators)
        if (breakdown) tempContainer.appendChild(breakdown)
        
        document.body.appendChild(tempContainer)
        
        // Capturar la imagen
        const canvas = await html2canvas(tempContainer, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: tempContainer.offsetWidth,
          height: tempContainer.offsetHeight
        })
        
        // Limpiar el elemento temporal
        document.body.removeChild(tempContainer)
        
        // Convertir a blob y descargar
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `costos-aeronave-${new Date().toISOString().split('T')[0]}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          } else {
            alert('Error al generar la imagen. Por favor, inténtalo de nuevo.')
          }
        }, 'image/png')
        
      } catch (error) {
        console.error('Error al generar la imagen:', error)
        alert('Error al generar la imagen. Por favor, inténtalo de nuevo.')
      } finally {
        isGeneratingImage.value = false
      }
    }

    // Watcher para detectar cambios y mostrar feedback visual
    watch([basicParams, fixedCosts, variableCosts], () => {
      isUpdating.value = true
      setTimeout(() => {
        isUpdating.value = false
      }, 300)
    }, { deep: true })

    // Cálculos adicionales para mejor presentación
    const formattedCalculations = computed(() => {
      const calc = calculations.value
      return {
        ...calc,
        totalHoursPerYearFormatted: formatNumber(calc.totalHoursPerYear),
        totalAnnualFixedCostsFormatted: formatCurrency(calc.totalAnnualFixedCosts),
        weightedFuelCostFormatted: formatCurrency(calc.weightedFuelCost),
        totalVariableCostPerHourFormatted: formatCurrency(calc.totalVariableCostPerHour),
        fixedCostPerHourFormatted: formatCurrency(calc.fixedCostPerHour),
        totalCostPerHourFormatted: formatCurrency(calc.totalCostPerHour),
        totalWithVioticsFormatted: formatCurrency(calc.totalWithViotics)
      }
    })

    return {
      basicParams,
      fixedCosts,
      variableCosts,
      calculations,
      formattedCalculations,
      isUpdating,
      isGeneratingImage,
      formatCurrency,
      formatNumber,
      formatCurrencyForInput,
      parseCurrencyFromInput,
      formatCurrencyForDisplay,
      handleCurrencyInput,
      generateAndDownloadImage
    }
  },
})
