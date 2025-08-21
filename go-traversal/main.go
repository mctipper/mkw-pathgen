package main

import (
	"fmt"
	"go-traversal/internal/loader"
	"go-traversal/internal/model"
)
	

func main() {
	var anyString string = "A";
	fmt.Println((anyString));
    fmt.Println("Let's goooooooooo");

	trackGraph, _ := loader.LoadGraph()
	fmt.Println("Graph Length:", len(trackGraph))

	for parent, children := range trackGraph {
		fmt.Printf("Parent: %s\t\tChildren: %v\n", parent, children)
	}
	fmt.Println("")
	var targetTrack model.TrackId = "1"
	fmt.Printf("Id: %s\tParents: %v\n", targetTrack, trackGraph.GetParents(targetTrack))
	fmt.Printf("Id: %s\tChildren: %v\n", targetTrack, trackGraph.GetChildren(targetTrack))
}
