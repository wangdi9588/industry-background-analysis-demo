export interface IPatentInfoItem {
  name: string
  type: string
  applicant: string
  applicationNumber: string
  publicationDate: string
}

export interface IJournalInfoItem {
  title: string
  authors: string[]
  publishDate: string
  category: string
}

export interface IIndustryAcademicProjectInfoItem {
  name: string
  partners: string[]
  progress: string
  scale: string
  time: string
}

export interface IInnovativeProjectInfoItem {
  name: string
  type: string
  organizer: string
  partners: string[]
  budget: string
  duration: string
  keywords: string[]
}
