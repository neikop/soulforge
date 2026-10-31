import { Button, Code, HStack, Input, SimpleGrid, Stack } from '@chakra-ui/react'
import Select, { type SelectOption } from 'components/select'
import { FormField, InputNumber, toaster } from 'components/ui'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { DocsCard, SectionHeading } from '../shared'

type FormValues = {
  budget?: number
  framework: null | SelectOption
  name: string
}

const options: SelectOption[] = [
  { label: 'React 19', value: 'react' },
  { label: 'Vite 8', value: 'vite' },
  { label: 'Chakra UI 3', value: 'chakra' },
]

export function FormSection() {
  const [payload, setPayload] = useState<FormValues | null>(null)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      budget: 25_000,
      framework: options[0] ?? null,
      name: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setPayload(values)
    toaster.success({
      description: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
      title: 'Typed form submitted',
    })
  })

  return (
    <Stack gap={5} id="forms" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Forms"
        subtitle="Compose the shared wrappers with React Hook Form while keeping validation and submission state in the owning feature."
        title="Controlled and native fields share the same visual system."
      />

      <DocsCard title="React Hook Form preview">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Stack as="form" gap={4} onSubmit={(event) => void onSubmit(event)}>
            <FormField error={errors.name?.message} htmlFor="project-name" label="Project name" required>
              <Input
                id="project-name"
                placeholder="Operations dashboard"
                {...register('name', { required: 'Project name is required' })}
              />
            </FormField>

            <Controller
              control={control}
              name="budget"
              render={({ field }) => (
                <FormField htmlFor="project-budget" label="Budget">
                  <InputNumber
                    decimalScale={0}
                    id="project-budget"
                    name={field.name}
                    onBlur={field.onBlur}
                    onValueChange={(values) => field.onChange(values.floatValue)}
                    ref={field.ref}
                    value={field.value ?? ''}
                  />
                </FormField>
              )}
            />

            <Controller
              control={control}
              name="framework"
              render={({ field }) => (
                <FormField htmlFor="project-framework" label="Framework">
                  <Select
                    inputId="project-framework"
                    isClearable
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    options={options}
                    placeholder="Search a framework"
                    value={field.value}
                  />
                </FormField>
              )}
            />

            <HStack>
              <Button colorPalette="primary" loading={isSubmitting} type="submit" variant="solid">
                Submit
              </Button>
              <Button onClick={() => reset()} type="button" variant="outline">
                Reset
              </Button>
            </HStack>
          </Stack>

          <Code display="block" minH="180px" p={4} whiteSpace="pre-wrap">
            {payload ? JSON.stringify(payload, null, 2) : 'Submit the form to inspect its typed payload.'}
          </Code>
        </SimpleGrid>
      </DocsCard>
    </Stack>
  )
}
