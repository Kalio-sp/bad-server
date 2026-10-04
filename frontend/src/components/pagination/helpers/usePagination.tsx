import { AsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from '@store/hooks'
import { RootState } from '@store/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface PaginationResult<U> {
    data: U[]
    totalPages: number
    currentPage: number
    limit: number
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

type PaginatedPayload = { pagination: { totalPages: number } }

const usePagination = <T extends PaginatedPayload, U>(
    asyncAction: AsyncThunk<T, Record<string, unknown>, object>,
    selector: (state: RootState) => U[],
    defaultLimit: number
): PaginationResult<U> => {
    const dispatch = useDispatch()
    const data = useSelector(selector)
    const dataLengthRef = useRef(data.length)
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState<number>(1)

    dataLengthRef.current = data.length

    const currentPage = Math.min(
        Number(searchParams.get('page')) || 1,
        totalPages
    )

    const limit = Number(searchParams.get('limit')) || defaultLimit

    const updateURL = useCallback(
        (newParams: Record<string, number | undefined>) => {
            const updatedParams = new URLSearchParams(searchParams)
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined) {
                    updatedParams.set(key, value.toString())
                } else {
                    updatedParams.delete(key)
                }
            })
            setSearchParams(updatedParams)
        },
        [searchParams, setSearchParams]
    )

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries())

        dispatch(asyncAction({ ...params, page: currentPage, limit })).then(
            (response) => {
                const payload = response.payload as T | undefined
                if (payload?.pagination) {
                    setTotalPages(payload.pagination.totalPages)
                }
                if (dataLengthRef.current === 0 && currentPage > 1) {
                    updateURL({ page: 1, limit })
                }
            }
        )
    }, [asyncAction, currentPage, dispatch, limit, searchParams, updateURL])

    const nextPage = () => {
        if (currentPage < totalPages) {
            updateURL({ page: currentPage + 1, limit })
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            updateURL({ page: currentPage - 1, limit })
        }
    }

    const setPage = (page: number) => {
        const newPage = Math.max(1, Math.min(page, totalPages))
        updateURL({ page: newPage, limit })
    }

    const setLimit = (newLimit: number) => {
        updateURL({ page: 1, limit: newLimit }) // При изменении лимита возвращаемся на первую страницу
    }

    return {
        data,
        totalPages,
        currentPage,
        limit,
        nextPage,
        prevPage,
        setPage,
        setLimit,
    }
}

export default usePagination
