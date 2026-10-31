import type { FileUploadFileRejection } from '@chakra-ui/react'
import type { ComponentProps, ReactNode, Ref } from 'react'

import { Button, FileUpload, HStack, IconButton, Text } from '@chakra-ui/react'
import { forwardRef, useId, useState } from 'react'
import { FiFile, FiUploadCloud, FiX } from 'react-icons/fi'

type FileUploadRootProps = FileUpload.RootProps
type FileUploadHiddenInputProps = ComponentProps<typeof FileUpload.HiddenInput>

export type FileUploadFieldProps = Omit<
  FileUploadRootProps,
  'acceptedFiles' | 'children' | 'defaultAcceptedFiles' | 'onChange' | 'onFileChange' | 'onFileReject' | 'translations'
> & {
  chooseLabel?: string
  defaultFiles?: File[]
  description?: ReactNode
  dropzoneLabel?: string
  files?: File[]
  inputProps?: FileUploadHiddenInputProps
  onChange?: (files: File[]) => void
  onReject?: (rejections: FileUploadFileRejection[]) => void
  preview?: 'file' | 'image'
  rootRef?: Ref<HTMLDivElement>
  translations?: FileUploadRootProps['translations']
}

const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  FILE_EXISTS: 'This file has already been selected.',
  FILE_INVALID: 'The selected file is invalid.',
  FILE_INVALID_TYPE: 'This file type is not supported.',
  FILE_TOO_LARGE: 'The selected file is too large.',
  FILE_TOO_SMALL: 'The selected file is too small.',
  TOO_MANY_FILES: 'Too many files were selected.',
}

/**
 * Controlled or uncontrolled file picker with dropzone, validation feedback, removal and optional image preview.
 *
 * Accept rules, file count and size constraints are forwarded to Chakra File Upload. The forwarded ref targets the
 * native file input for form registration and focus; use `rootRef` for the layout element and `inputProps` for native,
 * ARIA or data attributes. The component returns browser `File` objects only; upload requests, existing remote image
 * URLs and domain-specific validation stay feature-owned. The entire dropzone is keyboard and pointer clickable, with
 * shared hover, active, invalid, disabled and read-only feedback. Local file rejection also activates the same invalid
 * surface and announcement contract.
 */
const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(function FileUploadField(props, ref) {
  const {
    chooseLabel = 'Choose file',
    defaultFiles,
    description,
    disabled = false,
    dropzoneLabel = 'Drag and drop files here',
    files,
    inputProps,
    invalid = false,
    onChange,
    onReject,
    preview = 'file',
    readOnly = false,
    rootRef,
    translations,
    ...rootProps
  } = props
  const [rejectionMessage, setRejectionMessage] = useState('')
  const rejectionMessageId = useId()
  const isInvalid = invalid || Boolean(rejectionMessage)
  const describedBy = [inputProps?.['aria-describedby'], rejectionMessage ? rejectionMessageId : undefined]
    .filter(Boolean)
    .join(' ')
    .trim()

  return (
    <FileUpload.Root
      {...rootProps}
      acceptedFiles={files}
      defaultAcceptedFiles={defaultFiles}
      disabled={disabled}
      invalid={isInvalid}
      onFileChange={(details) => {
        onChange?.(details.acceptedFiles)
        if (!details.rejectedFiles.length) setRejectionMessage('')
      }}
      onFileReject={(details) => {
        onReject?.(details.files)
        const firstError = details.files[0]?.errors[0]
        setRejectionMessage(firstError ? (DEFAULT_ERROR_MESSAGES[firstError] ?? 'The file could not be selected.') : '')
      }}
      readOnly={readOnly}
      ref={rootRef}
      translations={{ ...translations, dropzone: dropzoneLabel }}
    >
      <FileUpload.HiddenInput
        {...inputProps}
        aria-describedby={describedBy || undefined}
        aria-invalid={isInvalid ? true : inputProps?.['aria-invalid']}
        ref={ref}
      />
      <FileUpload.Dropzone
        _active={
          disabled || readOnly
            ? undefined
            : {
                background: isInvalid ? 'error.subtle' : 'primary.subtle',
                borderColor: isInvalid ? 'error.border' : 'primary.solid',
              }
        }
        _disabled={{ background: 'bg.muted', color: 'fg.muted' }}
        _hover={
          disabled || readOnly
            ? undefined
            : {
                background: isInvalid ? 'error.surface' : 'primary.surface',
                borderColor: isInvalid ? 'error.border' : 'primary.border',
              }
        }
        _readOnly={{
          background: isInvalid ? 'error.subtle' : 'bg.subtle',
          borderColor: isInvalid ? 'error.border' : 'border.default',
        }}
        background={isInvalid ? 'error.subtle' : 'bg.canvas'}
        borderColor={isInvalid ? 'error.border' : 'border.default'}
        borderRadius="md"
        cursor={disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer'}
        minHeight="9rem"
      >
        <FiUploadCloud aria-hidden="true" />
        <FileUpload.DropzoneContent>
          <Text textStyle="title">{dropzoneLabel}</Text>
          {description ? (
            <Text color="fg.subtle" textStyle="body">
              {description}
            </Text>
          ) : null}
        </FileUpload.DropzoneContent>
        <FileUpload.Trigger asChild>
          <Button size="sm" variant="outline">
            {chooseLabel}
          </Button>
        </FileUpload.Trigger>
      </FileUpload.Dropzone>

      {rejectionMessage ? (
        <Text color="error.fg" id={rejectionMessageId} role="alert" textStyle="body">
          {rejectionMessage}
        </Text>
      ) : null}

      <FileUpload.Context>
        {(context) => (
          <FileUpload.ItemGroup>
            {context.acceptedFiles.map((file) => (
              <FileUpload.Item
                borderColor="border.default"
                borderRadius="md"
                borderWidth={1}
                file={file}
                key={`${file.name}:${file.size}:${file.type}:${file.lastModified}`}
              >
                <FileUpload.ItemPreview>
                  {preview === 'image' ? (
                    <FileUpload.ItemPreviewImage alt="" height="12" objectFit="contain" width="12" />
                  ) : (
                    <FiFile aria-hidden="true" />
                  )}
                </FileUpload.ItemPreview>
                <FileUpload.ItemContent>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                </FileUpload.ItemContent>
                <HStack>
                  <FileUpload.ItemDeleteTrigger asChild>
                    <IconButton aria-label={`Remove ${file.name}`} size="sm" variant="ghost">
                      <FiX />
                    </IconButton>
                  </FileUpload.ItemDeleteTrigger>
                </HStack>
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
        )}
      </FileUpload.Context>
    </FileUpload.Root>
  )
})

export default FileUploadField
