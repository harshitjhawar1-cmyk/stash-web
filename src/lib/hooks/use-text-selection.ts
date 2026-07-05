'use client'

import { useState, useEffect, useCallback } from 'react'

interface TextSelectionState {
  selectedText: string | null
  selectionRect: DOMRect | null
  isSelecting: boolean
}

export function useTextSelection() {
  const [state, setState] = useState<TextSelectionState>({
    selectedText: null,
    selectionRect: null,
    isSelecting: false,
  })

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setState({
        selectedText: selection.toString().trim(),
        selectionRect: rect,
        isSelecting: true,
      })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection()
      if (!selection || selection.toString().trim().length === 0) {
        setState({
          selectedText: null,
          selectionRect: null,
          isSelecting: false,
        })
      } else {
        handleSelectionChange()
      }
    }, 10)
  }, [handleSelectionChange])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setState({
      selectedText: null,
      selectionRect: null,
      isSelecting: false,
    })
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [handleMouseUp, handleSelectionChange])

  return { ...state, clearSelection }
}
