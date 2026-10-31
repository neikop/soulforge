import { SimpleGrid, Stack } from '@chakra-ui/react'
import { FileUploadField, FormField } from 'components/ui'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

const IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'image/webp': ['.webp'],
}

export function FileUploadSection() {
  const [logoFiles, setLogoFiles] = useState<File[]>([])

  return (
    <Stack gap={5} id="file-upload" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="File Upload"
        subtitle="The shared field owns selection, constraints, removal and local preview. Features still own remote URLs, API uploads and persistence."
        title="Validate files before a feature starts uploading."
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <DocsCard title="Image and logo preview">
          <FormField
            helperText="PNG, JPG, SVG or WebP up to 2 MB."
            htmlFor="guide-logo-upload"
            label="Logo"
            messageId="guide-logo-upload-help"
          >
            <FileUploadField
              accept={IMAGE_ACCEPT}
              description="PNG, JPG, SVG or WebP · maximum 2 MB"
              files={logoFiles}
              inputProps={{
                'aria-describedby': 'guide-logo-upload-help',
                'aria-label': 'Logo files',
                id: 'guide-logo-upload',
              }}
              maxFiles={1}
              maxFileSize={2 * 1024 * 1024}
              name="logo"
              onChange={setLogoFiles}
              preview="image"
            />
          </FormField>
        </DocsCard>

        <DocsCard title="Generic document selection">
          <FormField
            helperText="Rejected type, size and file-count states are announced by the shared field."
            htmlFor="guide-document-upload"
            label="Documents"
            messageId="guide-document-upload-help"
          >
            <FileUploadField
              accept={{ 'application/pdf': ['.pdf'], 'text/csv': ['.csv'] }}
              description="PDF or CSV · up to three files"
              inputProps={{
                'aria-describedby': 'guide-document-upload-help',
                'aria-label': 'Document files',
                id: 'guide-document-upload',
              }}
              maxFiles={3}
              preview="file"
            />
          </FormField>
        </DocsCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 3 }} gap={5}>
        <DocsCard title="Disabled upload">
          <FileUploadField
            description="The full dropzone communicates that selection is unavailable."
            disabled
            inputProps={{ 'aria-label': 'Disabled file upload' }}
          />
        </DocsCard>

        <DocsCard title="Read-only upload">
          <FileUploadField
            description="Existing selection stays visible without implying click behavior."
            inputProps={{ 'aria-label': 'Read-only file upload' }}
            readOnly
          />
        </DocsCard>

        <DocsCard title="Invalid upload">
          <FileUploadField
            description="Constraint failures use the same full-surface invalid feedback."
            inputProps={{ 'aria-label': 'Invalid file upload' }}
            invalid
          />
        </DocsCard>
      </SimpleGrid>
    </Stack>
  )
}
