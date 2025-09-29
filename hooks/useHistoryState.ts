import { useState, useCallback, useRef, SetStateAction } from 'react';

export const useHistoryState = <T>(initialState: T): {
    state: T;
    setState: (newState: SetStateAction<T>) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
} => {
    const [state, _setState] = useState(initialState);
    const history = useRef<T[]>([initialState]);
    const pointer = useRef(0);

    const setState = useCallback((action: SetStateAction<T>) => {
        const newState = action instanceof Function ? action(history.current[pointer.current]) : action;
        
        if (JSON.stringify(history.current[pointer.current]) !== JSON.stringify(newState)) {
            const newHistory = history.current.slice(0, pointer.current + 1);
            newHistory.push(newState);
            history.current = newHistory;
            pointer.current = history.current.length - 1;
            _setState(newState);
        }
    }, []);

    const undo = useCallback(() => {
        if (pointer.current > 0) {
            pointer.current--;
            _setState(history.current[pointer.current]);
        }
    }, []);

    const redo = useCallback(() => {
        if (pointer.current < history.current.length - 1) {
            pointer.current++;
            _setState(history.current[pointer.current]);
        }
    }, []);

    return {
        state,
        setState,
        undo,
        redo,
        canUndo: pointer.current > 0,
        canRedo: pointer.current < history.current.length - 1,
    };
};
