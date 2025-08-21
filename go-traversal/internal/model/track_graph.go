package model

type TrackId string;

type Graph map[TrackId][]TrackId;

func (g Graph) GetChildren(id TrackId) []TrackId {
    if neighbors, ok := g[id]; ok {
        return neighbors
    }
    return []TrackId{}
}

func (g Graph) GetParents(id TrackId) []TrackId {
    var parents []TrackId
    for parent, children := range g {
        for _, child := range children {
            if child == id {
                parents = append(parents, parent)
                break // once parent found, can move on to next
            }
        }
    }
    return parents
}
