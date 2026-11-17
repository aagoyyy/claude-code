import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sb_people import *
doc = Doc(99); b = [f'<rect width="{W}" height="{H}" fill="{P(doc, "#F3E3C2", "#E4CCA0")}"/>']
b.append(cook_front(doc, 540, 1560, 2.6, 3))
for i, (x, kd, col, hr) in enumerate(((180, 'short', '#3E5A86', '#1A100C'), (540, 'long', '#B24A4A', '#2A1B15'), (900, 'cap', '#4A7A5A', '#3A2418'))):
    b.append(person_back(doc, x, 1800, 1.1, col, seed=20 + i, hair=hr, kind=kd, cap='#2F6FA8'))
open('svg/test.svg', 'w').write(page(doc, ''.join(b)))
