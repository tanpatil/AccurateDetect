#!/usr/bin/env python3

from keras.models import Sequential
from keras.layers import Dense
from keras import regularizers
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_curve
from sklearn.metrics import auc
from sklearn.ensemble import RandomForestClassifier
#import matplotlib.pyplot as plt
import numpy
import os

numpy.random.seed(7)

#get complete data set
filename = os.path.join(os.getcwd(),'Data\\detect a\\Only Numbers (normal).csv')
totalData = numpy.loadtxt(filename, delimiter=",")

#randomly split data into train, validation, test
#trainData, validationData, testData = getData(filename, 0.1, 0.2, False)

'''filename = os.path.join(os.getcwd(), '..', 'Data/detect a/Training Data.csv' )
trainData = numpy.loadtxt(filename, delimiter=",")
filename = os.path.join(os.getcwd(), '..', 'Data/detect a/Test Data.csv')
testData = numpy.loadtxt(filename, delimiter=",")'''

#split data
total = [totalData[:, 0:40], totalData[:, 40], totalData[:, 41]]

num = 0
for count in range(len(total[1])):
    if total[2][count] == 1:
        total[1][count] = 1
        num += 1
    else:
        total[1][count] = 0
print(num)
#define 10-fold cross validation
kfold = StratifiedKFold(n_splits=10, shuffle=True, random_state=7)

#create file to write in
filename = os.path.join(os.getcwd(),'Data\\detect a\\CrossValidation\\results.csv')
file = open(filename, 'w')

regularizer = [0, 0, 0.0025, 120] # first two are regularization
    #coefficients, epochs, threshold

bill = 0
wrong = 0
falsePositive = 0
for train, test in kfold.split(total[0], total[1]):
    model = Sequential()
    model.add(Dense(30, input_dim=40, kernel_regularizer=regularizers.l2(regularizer[0]), activation='relu'))
    model.add(Dense(25, kernel_regularizer=regularizers.l2(regularizer[1]), activation='relu'))
    #model.add(Dense(15, kernel_regularizer=regularizers.l2(regularizer[2]), activation='relu'))
    model.add(Dense(1, activation='sigmoid'))

    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    #class_weight makes false positives less desirable
    model.fit(total[0][train], total[1][train], class_weight={0: 1, 1: 1}, epochs=regularizer[3], batch_size=32, verbose = 0)

    accuracy = model.evaluate(total[0][train], total[1][train], verbose = 0)
    print("train: " + str(accuracy[1]*100))
    accuracy = model.evaluate(total[0][test], total[1][test], verbose = 0)
    print("total: " + str(accuracy[1]*100))


    #calculate prediction
    predictions = model.predict(total[0][test])

    #roc
    '''
    y_pred_keras = predictions.ravel()
    fpr, tpr, thresholds = roc_curve(total[1][test], y_pred_keras)
    aucKeras = auc(fpr, tpr)
    print(aucKeras)
    plt.figure(1)
    plt.plot([0, 1], [0, 1], 'k--')
    plt.plot(fpr, tpr, label='Keras (area = {:.3f})'.format(aucKeras))
    plt.xlabel('False positive rate')
    plt.ylabel('True positive rate')
    plt.title('ROC curve')
    plt.legend(loc='best')
    plt.show()'''
    # Zoom in view of the upper left corner.
    '''plt.figure(2)
    plt.xlim(0, 0.01)
    plt.ylim(0.70, 0.85)
    plt.plot([0, 1], [0, 1], 'k--')
    plt.plot(fpr, tpr, label='Keras (area = {:.3f})'.format(auc))
    plt.xlabel('False positive rate')
    plt.ylabel('True positive rate')
    plt.title('ROC curve (zoomed in at top left)')
    plt.legend(loc='best')
    plt.show()
    break'''

    predictions = predictions.tolist()
    #round predictions
    rounded = []
    for prediction in predictions:
        if prediction[0] > 0.3:
            rounded.append(1)
        else:
            rounded.append(0)

    #add cancer types
    types = total[2][test]

    #add real cancer value
    real = total[1][test]


    for count in range(len(rounded)):
        #print(types[count])
        if types[count] == 1:
            bill += 1
            if rounded[count] == 0:
                wrong += 1
        if types[count] == 0 and rounded[count] != 0:
            falsePositive += 1
        line = str(real[count]) + "," + str(rounded[count]) + "," + str(types[count])
        file.write(line + "\n")
accuracy = ((bill-wrong)/bill)*100

file.close()
print()
print(accuracy)
print(falsePositive)
print(regularizer)