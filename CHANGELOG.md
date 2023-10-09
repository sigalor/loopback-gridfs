# 1.1.2 (2023-10-09)

- fix: `GridFSRepository.exists` when file is empty (resulted in promise that is never resolved before)

# 1.1.1 (2022-12-09)

- fix: delay creation of `GridFSBucket` to when functions in `GridFSRepository` are actually called

# 1.1.0 (2022-12-09)

- add `GridFSRepository.uploadIgnoreDuplicate`

# 1.0.0 (2022-12-09)

- initial release
