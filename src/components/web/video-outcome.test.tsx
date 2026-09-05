import { describe, expect, it } from 'vitest'
import { interviewVideoQueryOptions } from './video-outcome'

describe('interviewVideoQueryOptions', () => {
  it('constructs the correct queryKey with candidate email and job_id', () => {
    const options = interviewVideoQueryOptions(
      'souvik.m1ndia@gmail.com',
      'GCP-ARCHITECT',
    )
    expect(options.queryKey).toEqual([
      'interview-video',
      'souvik.m1ndia@gmail.com',
      'GCP-ARCHITECT',
      'all',
    ])
  })

  it('constructs queryKey with specific session_id when provided', () => {
    const options = interviewVideoQueryOptions(
      'souvik.m1ndia@gmail.com',
      'GCP-ARCHITECT',
      '5522744686097203200',
    )
    expect(options.queryKey).toEqual([
      'interview-video',
      'souvik.m1ndia@gmail.com',
      'GCP-ARCHITECT',
      '5522744686097203200',
    ])
  })
})
