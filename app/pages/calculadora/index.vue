<template>
  <NuxtLayout>
    <div class="configuration-forms">
      <div class="form-container">
        <NuxtLink to="/">
          <button class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            version 1
          </button>
        </NuxtLink>
        <br>
        <h1>Calculadora de Costos de Aeronave</h1>

        <form @submit.prevent="handleSubmit" class="params-form">
          <!-- Años de Inversión -->
          <div class="form-section">
            <h2>Años de Inversión</h2>
            <div class="form-grid">
              <div class="input-group edited">
                <label for="anos_inversion">Años de Inversión</label>
                <input id="anos_inversion" type="number" v-model.number="formData.anos_inversion"
                  @input="updateParam('anos_inversion', $event.target.value)" min="1" max="50" placeholder="10" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Tasas y Cambios -->
          <div class="form-section">
            <h2>Tasas y Cambios</h2>
            <div class="form-grid">
              <div class="input-group">
                <label for="tasa_cambio_usd_mxn">Tasa de Cambio USD/MXN</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="tasa_cambio_usd_mxn" type="text" v-model="formattedData.tasa_cambio_usd_mxn"
                    @input="updateCurrencyField('tasa_cambio_usd_mxn', $event.target.value)" class="form-input" />
                  <div class="input-suffix">MXN</div>
                </div>
              </div>
              <div class="input-group">
                <label for="tasa_inflacion_anual">Tasa de Inflación Anual</label>
                <div class="input-wrapper">
                  <span class="currency">%</span>
                  <input id="tasa_inflacion_anual" type="number" step="0.1" v-model.number="formData.tasa_inflacion_anual"
                    @input="updateParam('tasa_inflacion_anual', $event.target.value)" class="form-input" />
                </div>
              </div>
              <div class="input-group">
                <label for="tasa_inflacion_usa">Tasa de Inflación USA</label>
                <div class="input-wrapper">
                  <span class="currency">%</span>
                  <input id="tasa_inflacion_usa" type="text" v-model="formattedData.tasa_inflacion_usa"
                    @input="updateCurrencyField('tasa_inflacion_usa', $event.target.value)" class="form-input" />
                </div>
              </div>
              <div class="input-group">
                <label for="tasa_depreciacion_anual">Tasa de Depreciación Anual</label>
                <div class="input-wrapper">
                  <span class="currency">%</span>
                  <input id="tasa_depreciacion_anual" type="text" v-model="formattedData.tasa_depreciacion_anual"
                    @input="updateCurrencyField('tasa_depreciacion_anual', $event.target.value)" class="form-input" />
                </div>
              </div>
            </div>
          </div>

          <!-- Horas de Vuelo -->
          <div class="form-section">
            <h2>Horas de Vuelo</h2>
            <div class="form-grid">
              <div class="input-group edited">
                <label for="hrs_vuelo_nacionales_anual">Horas de Vuelo Nacionales Anual</label>
                <div class="input-wrapper">
                  <span class="icon">✈</span>
                  <input id="hrs_vuelo_nacionales_anual" type="number"
                    v-model.number="formData.hrs_vuelo_nacionales_anual"
                    @input="updateParam('hrs_vuelo_nacionales_anual', $event.target.value)" class="form-input" />
                </div>
              </div>
              <div class="input-group edited">
                <label for="hrs_vuelo_extranjero_anual">Horas de Vuelo Extranjero Anual</label>
                <div class="input-wrapper">
                  <span class="icon">○</span>
                  <input id="hrs_vuelo_extranjero_anual" type="number"
                    v-model.number="formData.hrs_vuelo_extranjero_anual"
                    @input="updateParam('hrs_vuelo_extranjero_anual', $event.target.value)" class="form-input" />
                </div>
              </div>
            </div>
          </div>

          <!-- Costos de Turbosina -->
          <div class="form-section">
            <h2>Costos de Turbosina</h2>
            <div class="form-grid">
              <div class="input-group">
                <label for="costo_turbocina_mex_lt">Costo Turbosina México</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="costo_turbocina_mex_lt" type="text" v-model="formattedData.costo_turbocina_mex_lt"
                    @input="updateCurrencyField('costo_turbocina_mex_lt', $event.target.value)" class="form-input" />
                  <div class="input-suffix">MXN/Lt</div>
                </div>
              </div>
              <div class="input-group">
                <label for="costo_turbocina_usa_gal">Costo Turbosina USA</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="costo_turbocina_usa_gal" type="text" v-model="formattedData.costo_turbocina_usa_gal"
                    @input="updateCurrencyField('costo_turbocina_usa_gal', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD/Gal</div>
                </div>
              </div>
              <div class="input-group">
                <label for="turbocina_mex_lt_hora">Turbosina México</label>
                <div class="input-wrapper">
                  <span class="icon">⛽</span>
                  <input id="turbocina_mex_lt_hora" type="number" v-model.number="formData.turbocina_mex_lt_hora"
                    @input="updateParam('turbocina_mex_lt_hora', $event.target.value)" class="form-input" />
                </div>
                <small class="input-hint">Lt/Hora</small>
              </div>
              <div class="input-group">
                <label for="turbocina_usa_gal_hora">Turbosina USA</label>
                <div class="input-wrapper">
                  <span class="icon">⛽</span>
                  <input id="turbocina_usa_gal_hora" type="number" v-model.number="formData.turbocina_usa_gal_hora"
                    @input="updateParam('turbocina_usa_gal_hora', $event.target.value)" class="form-input" />
                </div>
                <small class="input-hint">Gal/Hora</small>
              </div>
            </div>
          </div>

          <!-- Mantenimiento -->
          <div class="form-section">
            <h2>Mantenimiento</h2>
            <div class="form-grid">
              <div class="input-group">
                <label for="costo_mtto_programado_total_anual">Costo Mtto Programado Total Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="costo_mtto_programado_total_anual" type="text"
                    v-model="formattedData.costo_mtto_programado_total_anual"
                    @input="updateCurrencyField('costo_mtto_programado_total_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
            </div>
          </div>



          <!-- Capacitación y Administración -->
          <div class="form-section">
            <h2>Capacitación y Administración</h2>
            <div class="form-grid">
              <div class="input-group edited-warn">
                <label for="reserva_capacitacion_pilotos_anual">Reserva Capacitación Pilotos Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="reserva_capacitacion_pilotos_anual" type="text"
                    v-model="formattedData.reserva_capacitacion_pilotos_anual"
                    @input="updateCurrencyField('reserva_capacitacion_pilotos_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
              <div class="input-group edited-warn">
                <label for="administracion_anual">Administración Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="administracion_anual" type="text" v-model="formattedData.administracion_anual"
                    @input="updateCurrencyField('administracion_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
            </div>
          </div>

          <!-- Sueldos -->
          <div class="form-section">
            <h2>Sueldos</h2>
            <div class="form-grid">
              <div class="input-group">
                <label for="sueldo_piloto_pic_anual">Sueldo Piloto PIC Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="sueldo_piloto_pic_anual" type="text" v-model="formattedData.sueldo_piloto_pic_anual"
                    @input="updateCurrencyField('sueldo_piloto_pic_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
              <div class="input-group">
                <label for="sueldo_piloto_sic_anual">Sueldo Piloto SIC Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="sueldo_piloto_sic_anual" type="text" v-model="formattedData.sueldo_piloto_sic_anual"
                    @input="updateCurrencyField('sueldo_piloto_sic_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
            </div>
          </div>

          <!-- Otros Costos -->
          <div class="form-section">
            <h2>Otros Costos</h2>
            <div class="form-grid">
              <div class="input-group edited-warn">
                <label for="guardia_hangar_anual">Guarda Hangar Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="guardia_hangar_anual" type="text" v-model="formattedData.guardia_hangar_anual"
                    @input="updateCurrencyField('guardia_hangar_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
              <div class="input-group">
                <label for="seguro_aeronave_anual">Seguro Aeronave Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="seguro_aeronave_anual" type="text" v-model="formattedData.seguro_aeronave_anual"
                    @input="updateCurrencyField('seguro_aeronave_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
              <div class="input-group">
                <label for="arrendamiento_anual">Arrendamiento Anual</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="arrendamiento_anual" type="text" v-model="formattedData.arrendamiento_anual"
                    @input="updateCurrencyField('arrendamiento_anual', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
                <small class="period-badge annual">anual</small>
              </div>
              <div class="input-group edited">
                <label for="precio_venta_aeronave">Precio de Venta de Aeronave</label>
                <div class="input-wrapper money-input">
                  <div class="input-prefix">$</div>
                  <input id="precio_venta_aeronave" type="text" v-model="formattedData.precio_venta_aeronave"
                    @input="updateCurrencyField('precio_venta_aeronave', $event.target.value)" class="form-input" />
                  <div class="input-suffix">USD</div>
                </div>
              </div>
            </div>
          </div>

          <h3>
            Resumen
          </h3>

          <div class="summary">
            <div class="item">
              <div class="item-label">Tasa de Inflación Anual</div>
              <div class="item-value">{{ formData.tasa_inflacion_anual }}%</div>
            </div>
            <div class="item">
              <div class="item-label">Costo Mtto Programado Total Anual con Inflación (USD)</div>
              <div class="item-value">
                ${{ formatCurrencyText(formattedCostoMttoInflacion) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Años de Inversión</div>
              <div class="item-value">{{ formData.anos_inversion }} años</div>
            </div>
          </div>

          <h3>
            Reservas de Mantenimiento Anuales
          </h3>

          <div class="summary">
            <div class="item">
              <div class="item-label">Reserva Mtto Programado Anual</div>
              <div class="item-value">
                ${{ formatCurrencyText(formData.reserva_mtto_programado_anual) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Reserva Mtto Discrepancias Anual</div>
              <div class="item-value">
                <!-- ${{ formatCurrencyText(formData.reserva_mtto_discrepancias_anual) }} -->
                ${{ formatCurrencyText(calc_reserva_mtto_discrepancias_anual) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Reserva Mtto Interiores Anual</div>
              <div class="item-value">
                <!-- ${{ formatCurrencyText(formData.reserva_mtto_interiores_anual) }} -->
                ${{ formatCurrencyText(calc_reserva_mtto_interiores_anual) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Reserva Mtto Total Anual</div>
              <div class="item-value">
                <!-- ${{ formatCurrencyText(formData.reserva_mtto_total_anual) }} -->
                ${{ formatCurrencyText(calc_reserva_mtto_total_anual) }}
              </div>
            </div>
          </div>

          <h3>
            Costos por Hora Anuales
          </h3>

          <div class="summary">
            <div class="item">
              <div class="item-label">Costo Arrendamiento por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_costo_arrendamiento_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo administrativo por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_costo_administrativo_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo Guardia Hangar por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_costo_guardia_hangar_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo de mantenimiento total por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_costo_mantenimiento_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo Seguro Aeronave por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_costo_seguro_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo combustible por hora nacional</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_fuel_mxn_costo_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo combustible por hora extranjero</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_fuel_usd_costo_hr) }}
              </div>
            </div>
            <div class="item">
              <div class="item-label">Costo programa motores por hora</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_programa_motor_anual) }}
              </div>
            </div>
          </div>

          <h3>
            Totales
          </h3>

          <div class="summary">
            <div class="item total-item">
              <div class="item-label">Costo total por hora (Sin Inflación)</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_total_costo_por_hora) }}
              </div>
            </div>
            <div class="item total-item">
              <div class="item-label">Costo total anual (Sin Inflación)</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_total_costo_anual) }}
              </div>
            </div>
          </div>

          <h3>
            Costo Total Anual con Inflación por Año
          </h3>

          <div class="table-container">
            <table class="cost-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Costo Total Anual</th>
                  <th>Incremento por Inflación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="costo in totalCostoAnualConInflacionPorAnio" :key="costo.anio">
                  <td>{{ costo.anio }}</td>
                  <td>${{ costo.costoFormateado }}</td>
                  <td>{{ costo.incrementoFormateado }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            Inversión
          </h3>

          <div class="summary">
            <div class="item total-item">
              <div class="item-label">Inversión Inicial</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_inversion_inicial) }}
              </div>
            </div>
            <div class="item total-item">
              <div class="item-label">Inversión Total</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_inversion_total) }}
              </div>
            </div>
            <div class="item total-item">
              <div class="item-label">Valor de Reventa</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_resale_value) }}
              </div>
            </div>
            <div class="item total-item">
              <div class="item-label">Ingresos por renta en {{ formData.anos_inversion }} años</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_ingresos_renta_anual) }}
              </div>
            </div>
            <div class="item total-item">
              <div class="item-label">Inversión proyectada a {{ formData.anos_inversion }} años</div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_inversion_final) }}
              </div>
            </div>
            <div class="item total-item positive-value">
              <div class="item-label">
                Posible beneficio fiscal (ISR 30%)
              </div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_beneficio_fiscal) }}
              </div>
            </div>
          </div>

          <h3>
            Paquete de Hrs de Vuelo
          </h3>

          <div class="table-container">
            <table class="cost-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Costo Paquete de Horas</th>
                  <th>Incremento por Inflación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="costo in paqueteHrsVuelo" :key="costo.anio">
                  <td>{{ costo.anio }}</td>
                  <td>${{ costo.costoFormateado }}</td>
                  <td>{{ costo.incrementoFormateado }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="summary">
            <div class="item total-item">
              <div class="item-label">
                Costo total del paquete de horas de vuelo
              </div>
              <div class="item-value">
                ${{ formatCurrencyText(paqueteHrsVueloTotal) }}
              </div>
            </div>
            <div class="item total-item" :class="{
              'negative-value': calc_diferencia_paquete_hrs_inversion < 0,
              'positive-value': calc_diferencia_paquete_hrs_inversion > 0
            }">
              <div class="item-label">
                Diferencia entre paquete de horas e inversión
              </div>
              <div class="item-value">
                ${{ formatCurrencyText(calc_diferencia_paquete_hrs_inversion) }}
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="form-actions">
            <button type="button" @click="resetToDefaults" class="btn btn-secondary">
              Restablecer Valores
            </button>
          </div>
        </form>
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