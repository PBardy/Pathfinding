# Pathfinding Simulator

## Description

This is a pathfinding simulation tool. A basic understanding of graph theory is computer science is required to use this tool.

The main part of the simulation is the central grid of cells, cells can be:
* Empty (blue)
* Walls (grey)
* Source and end nodes (green for the start, and red for the end)

Empty cells represent a vertex on a graph which shares an edge with neighboring cells which aren't walls. Walls can be added by left-clicking on an empty cell, and can be removed by right-clicking.

Once you've created your desired graph you can change the pathfinding simulation options via the control panel. This allows you to:

* Change the grid size (this will reset your graph)
* Clear walls
* Change the pathfinding algorithm to simulate
* Change the heuristic the pathfinding algorithm uses
* Start the simulation
* Reset the simulation
* Replay the simulation (continuously or in discrete steps)

### Pathfinding

A pathfinding search begins from the green source node and attempts to 'search' the grid by exploring the graph in hopes of finding the red end node. During this search the algorithm expands a frontier and eventually discovers the most optimal path between the start and ends nodes. The frontier of visited notes (at a particular iteration) is represented by a light green color and the path is highlighted clearly in pink, with a red line showing the path itself.

Beginning the search will simply output the state of the algorithm once it has completed its search. Replaying the search through the control panel will highlight how the frontier expands during the search in a more human friendly manner. 

## Roadmap

The simulation currently only supports three types of pathfinding algorithms:

* Breadth-first search
* Depth-first search
* Dijkstra

Algorithms still to implement:

* A*
* IDA*
* Jump-point search
* Orthoganol-point search
* Trace

## Screenshots

<img src="screenshots/projects-pathfinding-1.jpg" alt="Screenshot 1" width="256">
<img src="screenshots/projects-pathfinding-2.jpg" alt="Screenshot 2" width="256">
<img src="screenshots/projects-pathfinding-3.jpg" alt="Screenshot 3" width="256">
<img src="screenshots/projects-pathfinding-4.jpg" alt="Screenshot 4" width="256">
<img src="screenshots/projects-pathfinding-5.jpg" alt="Screenshot 5" width="256">
<img src="screenshots/projects-pathfinding-6.jpg" alt="Screenshot 6" width="256">
<img src="screenshots/projects-pathfinding-7.jpg" alt="Screenshot 7" width="256">