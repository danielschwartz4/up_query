# parse txt

lines = open('OWNCUR6.txt', 'r').readlines()

for i in range(10):
  fields = lines[i].split('|')
  print(fields)
