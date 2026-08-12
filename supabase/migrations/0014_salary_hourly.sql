-- Some scraped/imported listings only give an hourly rate (e.g. "$26 - $36")
-- rather than an annual salary. Rather than dropping that data, salary_min/
-- salary_max store the hourly figures directly and this flag tells the UI
-- to render "$26 - $36/hr" instead of treating it as an annual salary.
alter table jobs add column if not exists salary_hourly boolean default false;
