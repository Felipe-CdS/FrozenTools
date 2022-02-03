import requests, os

os.environ['NO_PROXY'] = '127.0.0.1'

blockNumber = int(5774644)
apiString = "http://127.0.0.1:3000/alchemy?blockNumber="

for i in range(200, 1000):
    response = requests.get(apiString + str(blockNumber))
    print("block ", blockNumber, "||", response)
    blockNumber += 1