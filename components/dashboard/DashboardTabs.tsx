'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  applications: React.ReactNode
  saved: React.ReactNode
  listings: React.ReactNode
}

const TABS = [
  { value: 'applications', label: 'Applications' },
  { value: 'saved', label: 'Saved Jobs' },
  { value: 'listings', label: 'My Listings' },
] as const

type TabValue = (typeof TABS)[number]['value']

export default function DashboardTabs({ applications, saved, listings }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const activeTab = (params.get('tab') as TabValue) ?? 'applications'

  function handleTabChange(value: string) {
    const next = new URLSearchParams(params.toString())
    next.set('tab', value)
    router.replace(`/dashboard?${next.toString()}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start border-b border-black bg-transparent p-0 h-auto gap-0">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="border-r border-black px-5 py-3 text-sm font-medium transition-colors duration-150 data-[state=active]:bg-black data-[state=active]:text-white hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="applications" className="mt-6">
        {applications}
      </TabsContent>
      <TabsContent value="saved" className="mt-6">
        {saved}
      </TabsContent>
      <TabsContent value="listings" className="mt-6">
        {listings}
      </TabsContent>
    </Tabs>
  )
}
