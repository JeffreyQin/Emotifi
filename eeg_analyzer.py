import torch
import os
import pandas as pd
import numpy as np

from classifier_model.architecture import Classifier, model_path
from classifier_model.data_utils import preproc_eeg, idx_to_class

model_path = 'classifier_model/classifier.pt'

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = Classifier().to(device)
model.load_state_dict(torch.load(model_path))

def infer(eeg_path):
    
    eeg_df = pd.read_csv(eeg_path)
    eeg_array = eeg_df.iloc[1:, 1:9].to_numpy()

    eeg = preproc_eeg(eeg_array)
    eeg = torch.tensor(eeg).type(dtype=torch.float32).unsqueeze(0)

    pred_probs = model(eeg).squeeze()
    pred_class = torch.argmax(pred_probs, dim=0).item()
    return idx_to_class[pred_class]


