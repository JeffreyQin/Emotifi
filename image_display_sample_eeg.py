import time
import brainflow
import numpy as np
from midiutil import MIDIFile

import pandas as pd
import matplotlib
import matplotlib.pyplot as plt

from brainflow.board_shim import BoardShim, BrainFlowInputParams, LogLevels, BoardIds
from brainflow.data_filter import DataFilter, FilterTypes, AggOperations, WindowOperations, DetrendOperations, NoiseTypes

def main():
    params = BrainFlowInputParams()
    board_id = BoardIds.SYNTHETIC_BOARD.value
    board = BoardShim(board_id, params)
    eeg_channels = board.get_eeg_channels(board_id)
    sampling_rate = board.get_sampling_rate(board_id)
    timestamp = BoardShim.get_timestamp_channel(board_id)

    board = BoardShim(board_id, params)
    board.prepare_session()

    board.start_stream()
    BoardShim.log_message(LogLevels.LEVEL_INFO.value, 'start sleeping in the main thread')
    time.sleep(10)
    nfft = DataFilter.get_nearest_power_of_two(sampling_rate)
    data = board.get_board_data()
    eeg_channels = BoardShim.get_eeg_channels(board_id)
    
        
    eeg_channel = eeg_channels[3]
    psd = DataFilter.get_psd_welch(data[eeg_channel], nfft, nfft // 2, sampling_rate, WindowOperations.NO_WINDOW.value)
    df = pd.DataFrame(np.transpose(data))
    plt.figure()
    df[eeg_channels[:3]].plot(subplots=True)
    plt.savefig("before_processing.png")

    # for demo apply different filters to different channels, in production choose one
    for count, channel in enumerate(eeg_channels):
        # # filters work in-place
        DataFilter.perform_bandpass(data[channel], BoardShim.get_sampling_rate(board_id), 1.0, 30.0, 4,
                                        FilterTypes.BUTTERWORTH.value, 0)
        DataFilter.remove_environmental_noise(data[channel], BoardShim.get_sampling_rate(board_id), NoiseTypes.FIFTY.value)

    
    bands = DataFilter.get_avg_band_powers(data, eeg_channels, sampling_rate, True)

    df = pd.DataFrame(np.transpose(data))
    plt.figure()
    df[eeg_channels[:3]].plot(subplots=True)
    plt.savefig("after_processing.png")

if __name__ == "__main__":
    main()
