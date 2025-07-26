<template>
  <NuxtLayout>

    <div class="page-wrapper">
      <div class="head-page">
        <div class="content-wrapper">
          <img src="/white-logo.png" alt="SAE Logo" class="logo-image">
          <h1>
            Sistema de Proyección para Aeronaves
            <small>
              Servicios Aéreos Estrella
            </small>
          </h1>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="aircraft-info-card">
          <h2 class="aircraft-title">
            LearJet 45
          </h2>
          <p class="aircraft-registration">
            XA-ADE
          </p>
          <div class="aircraft-details">
            <p>
              Número de Serie: 52
            </p>
            <p>
              Número de registro: N233MK
            </p>
          </div>

          <div class="configuration-toggle">
            <button type="button" @click="toggleConfiguration" class="btn">
              <svg v-if="!showConfiguration" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
              </svg>
              <svg v-else baseProfile="tiny" id="Layer_1" version="1.2" viewBox="0 0 24 24"
                xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-show="!showConfiguration" class="content-wrapper cover-wrapper">
        <div class="indicators-wrapper">
          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Precio de Compra</div>
              <div class="indicator-value success">USD {{ formatCurrencyText(formData.precio_venta_aeronave) }}</div>
              <div class="indicator-subtitle">Inversión inicial</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Valor de Reventa</div>
              <div class="indicator-value info">USD {{ formatCurrencyText(calc_resale_value) }}</div>
              <div class="indicator-subtitle">Valor estimado al final</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Costo por Hora</div>
              <div class="indicator-value">USD {{ formatCurrencyText(calc_total_costo_por_hora) }}</div>
              <div class="indicator-subtitle">Precio final de operación</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Costos Fijos por Hora</div>
              <div class="indicator-value">USD {{ formatCurrencyText(calc_costo_arrendamiento_hr +
                calc_costo_administrativo_hr + calc_costo_guardia_hangar_hr + calc_costo_seguro_hr) }}</div>
              <div class="indicator-subtitle">Por hora de vuelo</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Costos Variables por Hora</div>
              <div class="indicator-value">USD {{ formatCurrencyText(calc_fuel_mxn_costo_hr + calc_fuel_usd_costo_hr +
                calc_costo_mantenimiento_hr + calc_programa_motor_anual) }}</div>
              <div class="indicator-subtitle">Por hora de vuelo</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Inversión Inicial</div>
              <div class="indicator-value">USD {{ formatCurrencyText(calc_inversion_inicial) }}</div>
              <div class="indicator-subtitle">Aeronave + Gastos primer año</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Tiempo de inversión</div>
              <div class="indicator-value">{{ formData.anos_inversion }} Años</div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Inversión total proyectada</div>
              <div class="indicator-value">USD {{ formatCurrencyText(calc_inversion_final) }}</div>
              <div v-if="calc_rentabilidad_paquete_hrs > 0 || calc_rentabilidad_paquete_hrs_beneficio_fiscal > 0" class="indicator-subtitle success">
                <span>
                  {{ calc_rentabilidad_paquete_hrs > 0 ? calc_rentabilidad_paquete_hrs : 0 }}%
                </span>
                a
                <span>
                  {{ calc_rentabilidad_paquete_hrs_beneficio_fiscal > 0 ? calc_rentabilidad_paquete_hrs_beneficio_fiscal : 0 }}%
                </span>
                <span>Más rentable que un paquete de horas</span>
              </div>
            </div>
          </div>

          <div class="indicator-card">
            <div class="indicator-content">
              <div class="indicator-label">Resumen de Horas de Vuelo</div>
              <div class="hours-summary-content">
                <div class="item-value">
                  <span>Total de horas anuales</span>
                  <span>{{ horasConfig.horas_totales }} hrs</span>
                </div>
                <div class="item-value">
                  <span>Porcentaje Nacional</span>
                  <span>{{ horasConfig.porcentaje_hrs_nacionales }}%</span>
                </div>
                <div class="item-value">
                  <span>Porcentaje Internacional</span>
                  <span>{{ horasConfig.porcentaje_hrs_extranjero }}%</span>
                </div>
                <div class="item-value">
                  <span>Total Horas ({{ formData.anos_inversion }} años)</span>
                  <span>{{ (formData.hrs_vuelo_nacionales_anual + formData.hrs_vuelo_extranjero_anual) *
                    formData.anos_inversion }} horas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="financial-summary-wrapper">
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Costo Total Anual (Valor presente)</span>
              <span class="summary-value warning">USD {{ formatCurrencyText(calc_total_costo_anual) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Inversión Total</span>
              <span class="summary-value warning">USD {{ formatCurrencyText(calc_inversion_total) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Valor de Reventa</span>
              <span class="summary-value success">USD {{ formatCurrencyText(calc_resale_value) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Ingresos por arrendamiento de la aeronave</span>
              <span class="summary-value success">USD {{ formatCurrencyText(calc_ingresos_renta_anual) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Ingreso por renta (SAE)</span>
              <span class="summary-value success">USD {{ formatCurrencyText(calc_ingresos_renta_sae) }}</span>
            </div>
            <div class="summary-item highlight">
              <span class="summary-label">Inversión proyectada a {{ formData.anos_inversion }} años</span>
              <span class="summary-value info">USD {{ formatCurrencyText(calc_inversion_final) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Posible beneficio fiscal (ISR 30%)</span>
              <span class="summary-value success">USD {{ formatCurrencyText(calc_beneficio_fiscal) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Inversión proyectada con posible beneficio fiscal aplicado</span>
              <span class="summary-value light opacity-75">USD {{ formatCurrencyText(calc_inversion_final_beneficio_fiscal) }}</span>
            </div>
          </div>
        </div>

        <!-- Desglose Detallado en dos columnas -->
        <div class="detailed-breakdown">
          <!-- Costos por Hora de Vuelo -->
          <div class="breakdown-card">
            <div class="breakdown-header">
              <h3>Costos por Hora de Vuelo</h3>
            </div>
            <div class="breakdown-content">
              <div class="breakdown-items-wrapper">
                <div class="breakdown-item">
                  <div class="item-icon">📋</div>
                  <div class="item-details">
                    <div class="item-name">Costo Administrativo</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_costo_administrativo_hr) }}</div>
                    <div class="item-annual">Incluye administración, capacitación y sueldos</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">🏠</div>
                  <div class="item-details">
                    <div class="item-name">Costo Guardia Hangar</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_costo_guardia_hangar_hr) }}</div>
                    <div class="item-annual">por hora</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">🔧</div>
                  <div class="item-details">
                    <div class="item-name">Costo Mantenimiento Total</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_costo_mantenimiento_hr) }}</div>
                    <div class="item-annual">por hora</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">⛽</div>
                  <div class="item-details">
                    <div class="item-name">Combustible Nacional</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_fuel_mxn_costo_hr) }}</div>
                    <div class="item-annual">por hora</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">🌍</div>
                  <div class="item-details">
                    <div class="item-name">Combustible Extranjero</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_fuel_usd_costo_hr) }}</div>
                    <div class="item-annual">por hora</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">⚙️</div>
                  <div class="item-details">
                    <div class="item-name">Programa Motores</div>
                    <div class="item-period">por hora</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_programa_motor_anual) }}</div>
                    <div class="item-annual">por hora</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reservas de Mantenimiento -->
          <div class="breakdown-card">
            <div class="breakdown-header">
              <h3>Reservas de Mantenimiento</h3>
            </div>
            <div class="breakdown-content">
              <div class="breakdown-items-wrapper">
                <div class="breakdown-item">
                  <div class="item-icon">🔧</div>
                  <div class="item-details">
                    <div class="item-name">Reserva Mtto Programado</div>
                    <div class="item-period">anual</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(formData.reserva_mtto_programado_anual) }}</div>
                    <div class="item-annual">anual</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">⚠️</div>
                  <div class="item-details">
                    <div class="item-name">Reserva Mtto Discrepancias</div>
                    <div class="item-period">anual</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_reserva_mtto_discrepancias_anual) }}</div>
                    <div class="item-annual">anual</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">🪑</div>
                  <div class="item-details">
                    <div class="item-name">Reserva Mtto Interiores</div>
                    <div class="item-period">anual</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(calc_reserva_mtto_interiores_anual) }}</div>
                    <div class="item-annual">anual</div>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="item-icon">💰</div>
                  <div class="item-details">
                    <div class="item-name">Costo Mtto con Inflación</div>
                    <div class="item-period">total</div>
                  </div>
                  <div class="item-values">
                    <div class="item-cost">USD {{ formatCurrencyText(formattedCostoMttoInflacion) }}</div>
                    <div class="item-annual">con inflación USA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showConfiguration" class="content-wrapper configuration-forms">
        <div class="form-container">
          <div  class="configuration-section">
            <form @submit.prevent="handleSubmit" class="params-form">
              <div class="form-section">
                <div class="form-grid">
                  <div class="input-group">
                    <label for="anos_inversion">Años de Inversión</label>
                    <input id="anos_inversion" type="number" v-model.number="formData.anos_inversion"
                      @input="updateParam('anos_inversion', $event.target.value)" min="1" max="50" placeholder="10"
                      class="form-input" />
                  </div>
                  <div class="input-group">
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

              <!-- Tasas y Cambios -->
              <div class="form-section" hidden>
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
                      <input id="tasa_inflacion_anual" type="number" step="0.1"
                        v-model.number="formData.tasa_inflacion_anual"
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
                        @input="updateCurrencyField('tasa_depreciacion_anual', $event.target.value)"
                        class="form-input" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Horas de Vuelo -->
              <div class="form-section">
                <div class="form-grid">
                  <div class="input-group">
                    <label for="horas_totales">Horas Totales Anuales</label>
                    <div class="input-wrapper">
                      <span class="icon">🕐</span>
                      <select id="horas_totales" :value="horasConfig.horas_totales"
                        @change="actualizarHorasTotales(Number($event.target.value))" class="form-input">
                        <option v-for="horas in horasOpciones" :key="horas" :value="horas">
                          {{ horas }} horas
                        </option>
                      </select>
                    </div>
                    <small class="input-hint">Total de horas de vuelo al año</small>
                  </div>

                  <div class="input-group">
                    <label for="porcentaje_hrs_nacionales">Porcentaje Horas Nacionales</label>
                    <div class="input-wrapper">
                      <span class="icon">
                        %
                      </span>
                      <input id="porcentaje_hrs_nacionales" type="number" min="0" max="100"
                        :value="horasConfig.porcentaje_hrs_nacionales"
                        @input="actualizarPorcentaje('nacionales', $event.target.value)" class="form-input" />
                    </div>
                    <small class="input-hint">{{ formData.hrs_vuelo_nacionales_anual }} horas</small>
                  </div>

                  <div class="input-group">
                    <label for="porcentaje_hrs_extranjero">Porcentaje Horas Internacionales</label>
                    <div class="input-wrapper">
                      <span class="icon">
                        %
                      </span>
                      <input id="porcentaje_hrs_extranjero" type="number" min="0" max="100"
                        :value="horasConfig.porcentaje_hrs_extranjero"
                        @input="actualizarPorcentaje('extranjero', $event.target.value)" class="form-input" />
                    </div>
                    <small class="input-hint">{{ formData.hrs_vuelo_extranjero_anual }} horas</small>
                  </div>

                </div>
                <div class="form-grid">
                  <div class="input-group">
                    <label for="horas_renta_sae">Horas Renta SAE</label>
                    <div class="input-wrapper">
                      <span class="icon">🕐</span>
                      <input id="horas_renta_sae" type="number" min="0" step="100"
                        v-model.number="formData.horas_renta_sae"
                        @blur="updateParam('horas_renta_sae', $event.target.value)" class="form-input" />
                    </div>
                    <small class="input-hint">Horas anuales para renta SAE (múltiplo de 100)</small>
                    <div v-if="validationMessage" class="validation-message">
                      {{ validationMessage }}
                    </div>
                  </div>

                  <div class="input-group">
                    <label for="precio_hr_renta">Precio Hr. Renta SAE</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="precio_hr_renta" type="text" v-model="formattedData.precio_hr_renta"
                        @input="updateCurrencyField('precio_hr_renta', $event.target.value)" class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="input-hint">Precio por hora de renta</small>
                  </div>
                </div>
              </div>

              <!-- Opciones de Costos -->
              <div class="form-section">
                <div class="form-grid">
                  <div class="input-group">
                    <div class="checkbox-wrapper">
                      <input 
                        id="incluir_capacitacion_pilotos" 
                        type="checkbox" 
                        v-model="costosOpcionales.incluir_capacitacion_pilotos"
                        class="form-checkbox" 
                      />
                      <label for="incluir_capacitacion_pilotos" class="checkbox-label">
                        <span class="checkbox-text">Incluir Reserva Capacitación Pilotos Anual</span>
                        <span class="checkbox-value">USD {{ formatCurrencyText(formData.reserva_capacitacion_pilotos_anual) }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="input-group">
                    <div class="checkbox-wrapper">
                      <input 
                        id="incluir_administracion" 
                        type="checkbox" 
                        v-model="costosOpcionales.incluir_administracion"
                        class="form-checkbox" 
                      />
                      <label for="incluir_administracion" class="checkbox-label">
                        <span class="checkbox-text">Incluir Administración Anual</span>
                        <span class="checkbox-value">USD {{ formatCurrencyText(formData.administracion_anual) }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="input-group">
                    <div class="checkbox-wrapper">
                      <input 
                        id="incluir_guardia_hangar" 
                        type="checkbox" 
                        v-model="costosOpcionales.incluir_guardia_hangar"
                        class="form-checkbox" 
                      />
                      <label for="incluir_guardia_hangar" class="checkbox-label">
                        <span class="checkbox-text">Incluir Guarda Hangar Anual</span>
                        <span class="checkbox-value">USD {{ formatCurrencyText(formData.guardia_hangar_anual) }}</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Costos de Turbosina -->
              <div class="form-section" hidden>
                <h2>Costos de Turbosina</h2>
                <div class="form-grid">
                  <div class="input-group">
                    <label for="costo_turbocina_mex_lt">Costo Turbosina México</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="costo_turbocina_mex_lt" type="text" v-model="formattedData.costo_turbocina_mex_lt"
                        @input="updateCurrencyField('costo_turbocina_mex_lt', $event.target.value)"
                        class="form-input" />
                      <div class="input-suffix">MXN/Lt</div>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="costo_turbocina_usa_gal">Costo Turbosina USA</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="costo_turbocina_usa_gal" type="text" v-model="formattedData.costo_turbocina_usa_gal"
                        @input="updateCurrencyField('costo_turbocina_usa_gal', $event.target.value)"
                        class="form-input" />
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
              <div class="form-section" hidden>
                <h2>Mantenimiento</h2>
                <div class="form-grid">
                  <div class="input-group">
                    <label for="costo_mtto_programado_total_anual">Costo Mtto Programado Total Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="costo_mtto_programado_total_anual" type="text"
                        v-model="formattedData.costo_mtto_programado_total_anual"
                        @input="updateCurrencyField('costo_mtto_programado_total_anual', $event.target.value)"
                        class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                </div>
              </div>



              <!-- Capacitación y Administración -->
              <div class="form-section" hidden>
                <div class="form-grid">
                  <div class="input-group-warn">
                    <label for="reserva_capacitacion_pilotos_anual">Reserva Capacitación Pilotos Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="reserva_capacitacion_pilotos_anual" type="text"
                        v-model="formattedData.reserva_capacitacion_pilotos_anual"
                        @input="updateCurrencyField('reserva_capacitacion_pilotos_anual', $event.target.value)"
                        class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                  <div class="input-group-warn">
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
              <div class="form-section" hidden>
                <div class="form-grid">
                  <div class="input-group">
                    <label for="sueldo_piloto_pic_anual">Sueldo Piloto PIC Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="sueldo_piloto_pic_anual" type="text" v-model="formattedData.sueldo_piloto_pic_anual"
                        @input="updateCurrencyField('sueldo_piloto_pic_anual', $event.target.value)"
                        class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                  <div class="input-group">
                    <label for="sueldo_piloto_sic_anual">Sueldo Piloto SIC Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="sueldo_piloto_sic_anual" type="text" v-model="formattedData.sueldo_piloto_sic_anual"
                        @input="updateCurrencyField('sueldo_piloto_sic_anual', $event.target.value)"
                        class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                </div>
              </div>

              <!-- Otros Costos -->
              <div class="form-section" hidden>
                <div class="form-grid">
                  <div class="input-group-warn">
                    <label for="guardia_hangar_anual">Guarda Hangar Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="guardia_hangar_anual" type="text" v-model="formattedData.guardia_hangar_anual"
                        @input="updateCurrencyField('guardia_hangar_anual', $event.target.value)" class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                  <div class="input-group" style="display: none;">
                    <label for="seguro_aeronave_anual">Seguro Aeronave Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="seguro_aeronave_anual" type="text" v-model="formattedData.seguro_aeronave_anual"
                        @input="updateCurrencyField('seguro_aeronave_anual', $event.target.value)" class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                  <div class="input-group" style="display: none;">
                    <label for="arrendamiento_anual">Arrendamiento Anual</label>
                    <div class="input-wrapper money-input">
                      <div class="input-prefix">$</div>
                      <input id="arrendamiento_anual" type="text" v-model="formattedData.arrendamiento_anual"
                        @input="updateCurrencyField('arrendamiento_anual', $event.target.value)" class="form-input" />
                      <div class="input-suffix">USD</div>
                    </div>
                    <small class="period-badge annual">anual</small>
                  </div>
                </div>
              </div>

              <h3>
                Resumen
              </h3>

              <div class="summary">
                <div class="item">
                  <div class="item-label">Años de Inversión</div>
                  <div class="item-value">{{ formData.anos_inversion }} años</div>
                </div>
                <div class="item">
                  <div class="item-label">Tasa de Inflación Anual (MXN)</div>
                  <div class="item-value">{{ formData.tasa_inflacion_anual }}%</div>
                </div>
                <div class="item">
                  <div class="item-label">Tasa de Inflación Anual (USA)</div>
                  <div class="item-value">{{ formData.tasa_inflacion_usa }}%</div>
                </div>
                <div class="item" >
                  <div class="item-label">Costo Mtto Programado Total Anual con Inflación (USD)</div>
                  <div class="item-value">
                    ${{ formatCurrencyText(formattedCostoMttoInflacion) }}
                  </div>
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
                    ${{ formatCurrencyText(calc_reserva_mtto_discrepancias_anual) }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-label">Reserva Mtto Interiores Anual</div>
                  <div class="item-value">
                    ${{ formatCurrencyText(calc_reserva_mtto_interiores_anual) }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-label">Reserva Mtto Total Anual</div>
                  <div class="item-value">
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
                  <div class="item-label">Costo administrativo por hora (Incluye sueldo de pilotos)</div>
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
                  <div class="item-label">Costo total por hora (A valor presente)</div>
                  <div class="item-value">
                    ${{ formatCurrencyText(calc_total_costo_por_hora) }}
                  </div>
                </div>
                <div class="item total-item">
                  <div class="item-label">Costo total anual (A valor presente)</div>
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
                  <div class="item-label">Ingresos por arrendamiento de la aeronave en {{ formData.anos_inversion }}
                    años
                  </div>
                  <div class="item-value">
                    ${{ formatCurrencyText(calc_ingresos_renta_anual) }}
                  </div>
                </div>
                <div class="item total-item">
                  <div class="item-label">Ingreso por renta (SAE) {{ formData.anos_inversion }} años</div>
                  <div class="item-value">
                    ${{ formatCurrencyText(calc_ingresos_renta_sae) }}
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
                Paquete de Hrs de Vuelo (USD 3,500/hr)
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
                <div class="item total-item" :class="{
                  'negative-value': calc_diferencia_paquete_hrs_inversion_beneficio_fiscal < 0,
                  'positive-value': calc_diferencia_paquete_hrs_inversion_beneficio_fiscal > 0
                }">
                  <div class="item-label">
                    Diferencia entre paquete de horas e inversión (Beneficio Fiscal)
                  </div>
                  <div class="item-value">
                    ${{ formatCurrencyText(calc_diferencia_paquete_hrs_inversion_beneficio_fiscal) }}
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