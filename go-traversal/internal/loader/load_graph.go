package loader

import (
	"encoding/json"
	"go-traversal/internal/config"
	"go-traversal/internal/model"
	"os"
)

func LoadGraph() (model.Graph, error) {
    file, err := os.Open(config.InputPath)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var graph model.Graph
    decoder := json.NewDecoder(file)
    if err := decoder.Decode(&graph); err != nil {
        return nil, err
    }
    return graph, nil
}
