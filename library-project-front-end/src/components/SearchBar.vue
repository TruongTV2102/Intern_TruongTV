<template>
  <div class="md:tw-mr-3 md:tw-w-48 tw-w-full tw-mb-3">
    <span class="tw-mr-1 tw-mt-1 tw-text-sm">精算申請番号</span>
    <template v-for="field in fields" :key="field.model">
      <!-- Q-INPUT -->
      <q-input
        v-if="['text', 'number', 'email'].includes(field.type)"
        v-model="search[field.model]"
        :label="field.label"
        :type="field.type"
        class="tw-w-full"
        outlined
        dense
        hide-bottom-space
        autocomplete="nope"
        no-error-icon
        :error="!!validationErrors?.[field.model]"
        :error-message="validationErrors?.[field.model]"
        @update:model-value="updateValue(field.model, $event)"
      />

      <!-- Q-DATE RANGE -->
      <q-input
        v-else-if="field.type === 'date'"
        v-model="formattedDateRange[field.model]"
        :label="field.label"
        class="tw-w-full"
        outlined
        dense
        hide-bottom-space
        autocomplete="nope"
        no-error-icon
        :error="!!validationErrors?.[field.model]"
        :error-message="validationErrors?.[field.model]"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="search[field.model]"
                range
                mask="YYYY-MM-DD"
                @update:model-value="updateValue(field.model, $event)"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Q-SELECT -->
      <q-select
        v-else-if="field.type === 'select'"
        v-model="search[field.model]"
        :options="field.options"
        option-value="value"
        option-label="label"
        :label="field.label"
        class="tw-w-full"
        outlined
        dense
        emit-value
        map-options
        hide-bottom-space
        autocomplete="nope"
        no-error-icon
        :error="!!validationErrors?.[field.model]"
        :error-message="validationErrors?.[field.model]"
        @update:model-value="updateValue(field.model, $event || null)"
      >
        <template v-if="search[field.model]" v-slot:append>
          <q-icon
            name="cancel"
            @click.stop.prevent="search[field.model] = null"
            class="cursor-pointer"
          />
        </template>
      </q-select>
    </template>

    <q-btn
      unelevated
      color="primary"
      icon="search"
      @click="emitSearch"
      class="tw-h-10 tw-w-10 sm:tw-w-auto"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { validateData } from 'src/schema/validator'

const props = defineProps({
  fields: Array,
  modelValue: Object,
  schema: Object,
})

const emit = defineEmits(['update:modelValue', 'search'])

const search = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formattedDateRange = computed(() => {
  const formatted = {}
  for (const field of props.fields) {
    if (field.type === 'date') {
      const { from, to } = search.value[field.model] || {}
      formatted[field.model] = from && to ? `${from} ~ ${to}` : ''
    }
  }
  return formatted
})

const validationErrors = ref({})

const validateForm = () => {
  console.log('schema', props.schema)
  console.log('value', search.value)
  const { errors, isValid } = validateData(search.value, props.schema)
  validationErrors.value = errors
  console.log(validationErrors)

  if (!isValid) return
  console.log('Error', validationErrors)
}

const updateValue = (key, value) => {
  search.value = { ...search.value, [key]: value }
  validateForm()
}

const emitSearch = () => {
  validateForm()
  if (Object.keys(validationErrors.value).length === 0) {
    emit('search', search.value)
  }
}
</script>
