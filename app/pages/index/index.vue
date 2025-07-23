<template>
  <NuxtLayout>
    <div class="calculator-container">

      <NuxtLink to="/calculadora">
          <button class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            version 2
          </button>
        </NuxtLink>
        <br>

      <!-- Banner del Avión -->
      <div class="aircraft-banner">
        <div class="aircraft-icon">
          <img src="https://sfo3.digitaloceanspaces.com/sae-assets/sae-bo-system/system-settings/1747711288216_logo.png" alt="Aircraft Icon" class="aircraft-image">
        </div>
      </div>

      <!-- Indicadores de Costos -->
      <div class="cost-indicators" :class="{ 'updating': isUpdating }">

        <div class="indicator-card purchase-price">
          <div class="indicator-content">
            <div class="indicator-label">Precio de Compra</div>
            <div class="indicator-value">USD {{ formatNumber(basicParams.purchasePrice) }}</div>
            <div class="indicator-subtitle">Inversión inicial</div>
          </div>
        </div>

        <div class="indicator-card resale-value">
          <div class="indicator-content">
            <div class="indicator-label">Valor de Reventa</div>
            <div class="indicator-value">USD {{ formatNumber(calculations.resaleValue) }}</div>
            <div class="indicator-subtitle">Valor estimado al final</div>
          </div>
        </div>

        <div class="indicator-card cost-per-hour-final">
          <div class="indicator-content">
            <div class="indicator-label">Costo por Hora Total</div>
            <div class="indicator-value">USD {{ formatNumber(calculations.totalWithViotics) }}</div>
            <div class="indicator-subtitle">Precio final de operación</div>
          </div>
        </div>
        
        <div class="indicator-card fixed-costs-per-hour">
          <div class="indicator-content">
            <div class="indicator-label">Costos Fijos Totales por Hora</div>
            <div class="indicator-value">USD {{ formatNumber(Math.round(calculations.totalFixedCostsOverPeriod / calculations.totalHoursOverPeriod)) }}</div>
            <div class="indicator-subtitle">Por hora de vuelo</div>
          </div>
        </div>
        
        <div class="indicator-card variable-costs-per-hour">
          <div class="indicator-content">
            <div class="indicator-label">Total Variables por Hora</div>
            <div class="indicator-value">USD {{ formatNumber(calculations.detailedVariableCosts.totalVariablePerHour) }}</div>
            <div class="indicator-subtitle">Por hora de vuelo</div>
          </div>
        </div>

        <div class="indicator-card hours-summary">
          <div class="indicator-content">
            <div class="indicator-label">Resumen de Horas de Vuelo</div>
            <div class="hours-details">
              <div class="hours-row">
                <span>Horas Nacionales / Año:</span>
                <span>{{ formatNumber(basicParams.nationalHoursPerYear) }}</span>
              </div>
              <div class="hours-row">
                <span>Horas Internacionales / Año:</span>
                <span>{{ formatNumber(basicParams.internationalHoursPerYear) }}</span>
              </div>
              <div class="hours-total">
                <span>Total Horas ({{ basicParams.ownershipYears }} años):</span>
                <span>{{ formatNumber(calculations.totalHoursOverPeriod) }} horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desglose Detallado -->
      <div class="detailed-breakdown" :class="{ 'updating': isUpdating }">
        <!-- Desglose Costos Fijos -->
        <div class="breakdown-card">
          <div class="breakdown-header">
            <h3>Desglose Detallado - Costos Fijos</h3>
          </div>
          <div class="breakdown-content">
            <div class="breakdown-items-wrapper">
              <div class="breakdown-item">
                <div class="item-icon">📋</div>
                <div class="item-details">
                  <div class="item-name">Arrendamiento</div>
                  <div class="item-period">mensual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.leasing.monthly) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🏠</div>
                <div class="item-details">
                  <div class="item-name">Hangar / Guarda</div>
                  <div class="item-period">mensual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.hangarGuard.monthly) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">📋</div>
                <div class="item-details">
                  <div class="item-name">Administración</div>
                  <div class="item-period">mensual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.administration.monthly) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🛡️</div>
                <div class="item-details">
                  <div class="item-name">Seguros</div>
                  <div class="item-period">anual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.insurance.annual) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🎓</div>
                <div class="item-details">
                  <div class="item-name">Reserva Capacitación Pilotos</div>
                  <div class="item-period">anual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.pilotTrainingReserve.annual) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🔧</div>
                <div class="item-details">
                  <div class="item-name">Reserva de Mantenimiento</div>
                  <div class="item-period">anual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.maintenanceReserve.annual) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">👨‍✈️</div>
                <div class="item-details">
                  <div class="item-name">Sueldo Piloto</div>
                  <div class="item-period">mensual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.pilotSalary.monthly) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">👩‍✈️</div>
                <div class="item-details">
                  <div class="item-name">Sueldo Copiloto</div>
                  <div class="item-period">mensual</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedFixedCosts.copilotSalary.monthly) }}</div>
                  <div class="item-annual">anual</div>
                </div>
              </div>
            </div>

            <div class="breakdown-total">
              <div class="total-content">
                <div class="total-label">Costos Fijos Totales</div>
                <div class="total-period">Para {{ basicParams.ownershipYears }} años</div>
                <div class="total-amount">USD {{ formatNumber(calculations.totalFixedCostsOverPeriod) }}</div>
                <div class="total-per-hour">USD {{ formatNumber(Math.round(calculations.totalFixedCostsOverPeriod / calculations.totalHoursOverPeriod)) }}/hora</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desglose Costos Variables -->
        <div class="breakdown-card">
          <div class="breakdown-header">
            <h3>Desglose Detallado - Costos Variables</h3>
          </div>
          <div class="breakdown-content">
            <div class="breakdown-items-wrapper">
              <div class="breakdown-item special">
                <!-- <div class="item-icon">⛽</div> -->
                <div class="item-details-wide">
                  <div class="item-name">Turbosina (Promedio Ponderado)</div>
                  <div class="turbine-details">
                    <div class="turbine-line">• Nacional: {{ calculations.detailedVariableCosts.turbine.nationalHoursPerYear }}h / año x USD {{ formatNumber(calculations.detailedVariableCosts.turbine.nationalCostPerHour) }}</div>
                                          <div class="turbine-line">• Internacional: {{ calculations.detailedVariableCosts.turbine.internationalHoursPerYear }}h / año x USD {{ formatNumber(calculations.detailedVariableCosts.turbine.internationalCostPerHour) }}</div>
                                          <div class="turbine-average">Promedio: USD {{ formatNumber(calculations.detailedVariableCosts.turbine.weightedAveragePerHour) }} / hora</div>
                  </div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🔧</div>
                <div class="item-details">
                  <div class="item-name">Programa de Motores</div>
                  <div class="item-period">por hora</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedVariableCosts.engineProgram.perHour) }}</div>
                  <div class="item-total">Total: USD {{ formatNumber(calculations.detailedVariableCosts.engineProgram.total) }}</div>
                </div>
              </div>

              <div class="breakdown-item">
                <div class="item-icon">🕒</div>
                <div class="item-details">
                  <div class="item-name">Reserva Mantenimiento / Hora</div>
                  <div class="item-period">por hora</div>
                </div>
                <div class="item-values">
                  <div class="item-cost">USD {{ formatNumber(calculations.detailedVariableCosts.maintenanceReservePerHour.perHour) }}</div>
                  <div class="item-total">Total: USD {{ formatNumber(calculations.detailedVariableCosts.maintenanceReservePerHour.total) }}</div>
                </div>
              </div>
            </div>

            <div class="breakdown-total">
              <div class="total-content">
                <div class="total-label">Total Variables</div>
                <div class="total-period">Para {{ formatNumber(calculations.totalHoursOverPeriod) }} horas</div>
                <div class="total-amount">USD {{ formatNumber(calculations.totalVariableCostsOverPeriod) }}</div>
                <div class="total-per-hour">USD {{ formatNumber(calculations.detailedVariableCosts.totalVariablePerHour) }}/hora</div>
              </div>
            </div>

            <div class="breakdown-divider"></div>

            <div class="breakdown-total-grand">
              <div class="total-content">
                <div class="total-label">Costo Total de Operación a {{ basicParams.ownershipYears }} Años</div>
                <div class="total-period">Para {{ formatNumber(calculations.totalHoursOverPeriod) }} horas</div>
                <div class="total-amount">USD {{ formatNumber(calculations.grandTotal) }}</div>
                <div class="total-per-hour">USD {{ formatNumber(Math.round(calculations.grandTotal / calculations.totalHoursOverPeriod)) }}/hora</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón para generar imagen -->
      <div class="download-section" >
        <button 
          @click="generateAndDownloadImage" 
          :disabled="isGeneratingImage"
          class="download-button"
          :class="{ 'generating': isGeneratingImage }"
        >
          <span v-if="!isGeneratingImage" class="button-icon">📸</span>
          <span v-else class="button-icon spinning">⟳</span>
          <span class="button-text">
            {{ isGeneratingImage ? 'Generando imagen...' : 'Descargar Reporte' }}
          </span>
        </button>
        <small class="download-hint">Genera una imagen con todos los indicadores y desgloses</small>
      </div>

      <div class="forms-grid">
        <!-- Formulario 1: Parámetros Básicos -->
        <div class="form-card">
          <div class="form-header">
            <div class="form-icon">$</div>
            <h2>Parámetros Básicos</h2>
          </div>
          
          <div class="form-body">
            <div class="input-group">
              <label>Precio de Compra</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(basicParams.purchasePrice)"
                  @input="handleCurrencyInput($event, basicParams, 'purchasePrice')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
            </div>
            
            <div class="input-group">
              <label>Factor de Pérdida de Valor Anual</label>
              <div class="input-wrapper">
                <span class="currency">%</span>
                <input 
                  type="number" 
                  v-model="basicParams.depreciationRate"
                  class="form-input"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              <small class="input-hint">Porcentaje de depreciación anual</small>
            </div>
            
            <div class="input-group">
              <label>Valor de Reventa Calculado</label>
              <div class="calculated-value">
                <div class="value-display">USD {{ formatNumber(calculations.resaleValue) }}</div>
                <small class="input-hint">Calculado automáticamente</small>
              </div>
            </div>
            
            <div class="input-group">
              <label>Horas Nacionales / Año</label>
              <div class="input-wrapper">
                <span class="icon">✈</span>
                <input 
                  type="number" 
                  v-model="basicParams.nationalHoursPerYear"
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="input-group">
              <label>Horas Internacionales / Año</label>
              <div class="input-wrapper">
                <span class="icon">○</span>
                <input 
                  type="number" 
                  v-model="basicParams.internationalHoursPerYear"
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="input-group">
              <label>Años de Propiedad</label>
              <input 
                type="number" 
                v-model="basicParams.ownershipYears"
                class="form-input"
              />
            </div>
            
            <div class="input-group">
              <label>% Viáticos (sobre variables)</label>
              <div class="input-wrapper">
                <span class="currency">%</span>
                <input 
                  type="number" 
                  v-model="basicParams.viaticsPercentage"
                  class="form-input"
                  step="0.1"
                />
              </div>
              <small class="input-hint">Margen sobre costos variables</small>
            </div>
          </div>
        </div>

        <!-- Formulario 2: Costos Fijos -->
        <div class="form-card">
          <div class="form-header">
            <div class="form-icon">•</div>
            <h2>Costos Fijos</h2>
          </div>
          
          <div class="form-body">
                                      <div class="input-group">
              <label>Hangar / Guarda</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.hangarGuard)"
                  @input="handleCurrencyInput($event, fixedCosts, 'hangarGuard')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge monthly">mensual</small>
              <small class="annual-cost">Anual: USD {{ formatNumber(fixedCosts.hangarGuard * 12) }}</small>
            </div>
            
            <div class="input-group">
              <label>Administración</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.administration)"
                  @input="handleCurrencyInput($event, fixedCosts, 'administration')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge monthly">mensual</small>
              <small class="annual-cost">Anual: USD {{ formatNumber(fixedCosts.administration * 12) }}</small>
            </div>
            
            <div class="input-group">
              <label>Seguros</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.insurance)"
                  @input="handleCurrencyInput($event, fixedCosts, 'insurance')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge annual">anual</small>
            </div>
            
            <div class="input-group">
              <label>Reserva Capacitación Pilotos</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.pilotTrainingReserve)"
                  @input="handleCurrencyInput($event, fixedCosts, 'pilotTrainingReserve')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge annual">anual</small>
            </div>
            
            <div class="input-group">
              <label>Reserva de Mantenimiento</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.maintenanceReserve)"
                  @input="handleCurrencyInput($event, fixedCosts, 'maintenanceReserve')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge annual">anual</small>
            </div>
            
            <div class="input-group">
              <label>Sueldo Piloto</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.pilotSalary)"
                  @input="handleCurrencyInput($event, fixedCosts, 'pilotSalary')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge monthly">mensual</small>
              <small class="annual-cost">Anual: USD {{ formatNumber(fixedCosts.pilotSalary * 12) }}</small>
            </div>
            
            <div class="input-group">
              <label>Sueldo Copiloto</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.copilotSalary)"
                  @input="handleCurrencyInput($event, fixedCosts, 'copilotSalary')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge monthly">mensual</small>
              <small class="annual-cost">Anual: USD {{ formatNumber(fixedCosts.copilotSalary * 12) }}</small>
            </div>
            
            <div class="input-group">
              <label>Arrendamiento</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(fixedCosts.leasing)"
                  @input="handleCurrencyInput($event, fixedCosts, 'leasing')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
              <small class="period-badge monthly">mensual</small>
              <small class="annual-cost">Anual: USD {{ formatNumber(fixedCosts.leasing * 12) }}</small>
            </div>
          </div>
        </div>

        <!-- Formulario 3: Costos Variables / Hora -->
        <div class="form-card">
          <div class="form-header">
            <div class="form-icon">⏱</div>
            <h2>Costos Variables / Hora</h2>
          </div>
          
          <div class="form-body">
            <div class="section-header">
              <h3>• Turbosina</h3>
            </div>
            
            <div class="input-group">
              <label>Precio México</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(variableCosts.turbineMexicoPrice)"
                  @input="handleCurrencyInput($event, variableCosts, 'turbineMexicoPrice')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
            </div>
            
            <div class="input-group">
              <label>Precio Extranjero</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(variableCosts.turbineForeignPrice)"
                  @input="handleCurrencyInput($event, variableCosts, 'turbineForeignPrice')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
            </div>
            
            <!-- <div class="cost-summary" :class="{ 'updating': isUpdating }">
              <p><strong>Costo Promedio Ponderado:</strong></p>
              <p class="highlight-cost">USD {{ formatNumber(calculations.weightedFuelCost) }}/hora</p>
            </div> -->
            
            <div class="section-header">
              <h3>Otros Costos Variables</h3>
            </div>
            
            <div class="input-group">
              <label>Programa de Motores</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(variableCosts.engineProgram)"
                  @input="handleCurrencyInput($event, variableCosts, 'engineProgram')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
            </div>
            
            <div class="input-group">
              <label>Reserva Mantenimiento / Hora</label>
              <div class="input-wrapper money-input">
                <div class="input-prefix">$</div>
                <input 
                  type="text" 
                  :value="formatCurrencyForInput(variableCosts.maintenanceReservePerHour)"
                  @input="handleCurrencyInput($event, variableCosts, 'maintenanceReservePerHour')"
                  class="form-input"
                  placeholder="0"
                />
                <div class="input-suffix">USD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script>
  import Controller from './index.controller.ts'
  export default Controller
</script>

<style lang="scss" scoped>
  @use './index.style.scss';
</style>