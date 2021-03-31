from bs4 import BeautifulSoup
import requests 

#URLS for specific data points
totcasesurl = 'https://covid.cdc.gov/covid-data-tracker/#cases_totalcases'
lst7casesurl = 'https://covid.cdc.gov/covid-data-tracker/#cases_casesinlast7days'
totdeathsurl = 'https://covid.cdc.gov/covid-data-tracker/#cases_totaldeaths'
lst7deathsurl = 'https://covid.cdc.gov/covid-data-tracker/#cases_deathsinlast7days'

html1 = requests.get(totcasesurl)
html2 = requests.get(lst7casesurl)
html3 = requests.get(totdeathsurl)
html4 = requests.get(lst7deathsurl)


soup = BeautifulSoup(html1.content, 'html.parser')
statedata = soup.find_all('tr')
print(soup)
